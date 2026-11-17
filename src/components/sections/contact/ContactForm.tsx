'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { contact } from '@/content/about';
import { site } from '@/content/site';
import {
  SERVICE_EVENT,
  type ContactErrorCode,
  type ContactErrors,
  type ContactField,
  type ServiceValue,
  normalise,
  validateContact,
  validateField,
} from '@/lib/contact';
import { Button } from '@/components/ui/Button';
import styles from './Contact.module.css';

type Status = 'idle' | 'sending' | 'success' | 'error';

const FIELD_ORDER: ContactField[] = ['name', 'email', 'phone', 'services', 'message'];

/**
 * Real contact form: client-side validation for instant feedback, server-side
 * validation as the authority, and a success state shown only after the
 * server confirms the inquiry was stored/delivered.
 */
export function ContactForm() {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const startedAt = useRef<number>(0);
  const [values, setValues] = useState({ name: '', email: '', phone: '', message: '' });
  const [services, setServices] = useState<ServiceValue[]>([]);
  const [company, setCompany] = useState('');
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState<string>('');

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Pre-select a service when arriving from "let's talk about…" links.
  useEffect(() => {
    const onSelect = (e: Event) => {
      const value = (e as CustomEvent<string>).detail as ServiceValue;
      setServices((prev) => (prev.includes(value) ? prev : [...prev, value]));
    };
    window.addEventListener(SERVICE_EVENT, onSelect);
    return () => window.removeEventListener(SERVICE_EVENT, onSelect);
  }, []);

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  const payload = () => normalise({ ...values, services, company });

  const check = (field: ContactField, next = payload()) => {
    const code = validateField(field, next);
    setErrors((prev) => {
      const copy = { ...prev };
      if (code) copy[field] = code;
      else delete copy[field];
      return copy;
    });
  };

  const handleChange = (field: 'name' | 'email' | 'phone' | 'message', value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field]) check(field, normalise({ ...next, services }));
  };

  const handleBlur = (field: ContactField) => {
    setTouched((t) => ({ ...t, [field]: true }));
    check(field);
  };

  const toggleService = (value: ServiceValue) => {
    const next = services.includes(value) ? services.filter((s) => s !== value) : [...services, value];
    setServices(next);
    if (touched.services) check('services', normalise({ ...values, services: next }));
  };

  const errorText = (code?: ContactErrorCode) => (code ? contact.errors[code] : '');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    const data = { ...payload(), elapsed: e.timeStamp && startedAt.current ? Date.now() - startedAt.current : undefined };
    const found = validateContact(data);
    setErrors(found);
    setTouched({ name: true, email: true, phone: true, services: true, message: true });
    if (Object.keys(found).length > 0) {
      setStatus('error');
      setServerError(contact.errors.summary);
      const first = FIELD_ORDER.find((f) => found[f]);
      const target = formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`);
      target?.focus();
      return;
    }

    setStatus('sending');
    setServerError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: ContactErrors; error?: string };
      if (res.ok && body.ok) {
        setStatus('success');
        return;
      }
      if (res.status === 422 && body.errors) setErrors(body.errors);
      setStatus('error');
      setServerError(
        res.status === 429 ? contact.errors.rate : res.status === 422 ? contact.errors.summary : contact.errors.server,
      );
    } catch {
      setStatus('error');
      setServerError(contact.errors.network);
    }
  };

  const reset = () => {
    setValues({ name: '', email: '', phone: '', message: '' });
    setServices([]);
    setErrors({});
    setTouched({});
    setServerError('');
    setStatus('idle');
    startedAt.current = Date.now();
  };

  if (status === 'success') {
    return (
      <div className={styles.success} role="status">
        <span className={styles.successMark} aria-hidden="true">
          <i />
        </span>
        <h3 ref={successRef} tabIndex={-1} className={styles.successTitle}>
          {contact.success.title}
        </h3>
        <p className={styles.successBody}>{contact.success.body}</p>
        <Button variant="secondary" onClick={reset} arrow="left">
          {contact.success.again}
        </Button>
      </div>
    );
  }

  const id = (f: string) => `${uid}-${f}`;
  const describedBy = (f: ContactField, hint?: boolean) =>
    [hint ? id(`${f}-hint`) : '', errors[f] ? id(`${f}-error`) : ''].filter(Boolean).join(' ') || undefined;

  return (
    <form ref={formRef} className={styles.form} noValidate onSubmit={onSubmit} aria-busy={status === 'sending'}>
      <div className={styles.alert} role="alert" aria-live="assertive">
        {status === 'error' && serverError && (
          <p className={styles.alertBox}>
            {serverError}
            {site.email && serverError !== contact.errors.summary && (
              <>
                {' '}
                אפשר גם לכתוב ישירות ל־
                <a href={`mailto:${site.email}`} className="ltr">
                  {site.email}
                </a>
                .
              </>
            )}
          </p>
        )}
      </div>

      <div className={styles.row}>
        <div className={styles.field} data-invalid={!!errors.name}>
          <label htmlFor={id('name')}>{contact.fields.name}</label>
          <input
            id={id('name')}
            data-field="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={120}
            value={values.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            aria-invalid={!!errors.name}
            aria-describedby={describedBy('name')}
          />
          {errors.name && (
            <p id={id('name-error')} className={styles.error}>
              {errorText(errors.name)}
            </p>
          )}
        </div>

        <div className={styles.field} data-invalid={!!errors.email}>
          <label htmlFor={id('email')}>{contact.fields.email}</label>
          <input
            id={id('email')}
            data-field="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            dir="ltr"
            required
            maxLength={254}
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy('email')}
          />
          {errors.email && (
            <p id={id('email-error')} className={styles.error}>
              {errorText(errors.email)}
            </p>
          )}
        </div>
      </div>

      <div className={styles.field} data-invalid={!!errors.phone}>
        <label htmlFor={id('phone')}>
          {contact.fields.phone} <span className={styles.optional}>({contact.fields.phoneHint})</span>
        </label>
        <input
          id={id('phone')}
          data-field="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
          maxLength={32}
          value={values.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          onBlur={() => handleBlur('phone')}
          aria-invalid={!!errors.phone}
          aria-describedby={describedBy('phone')}
        />
        {errors.phone && (
          <p id={id('phone-error')} className={styles.error}>
            {errorText(errors.phone)}
          </p>
        )}
      </div>

      <fieldset
        className={styles.fieldset}
        data-invalid={!!errors.services}
        aria-describedby={describedBy('services', true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) handleBlur('services');
        }}
      >
        <legend>
          {contact.fields.services}
          <span id={id('services-hint')} className={styles.optional}>
            {' '}
            ({contact.fields.servicesHint})
          </span>
        </legend>
        <div className={styles.chips}>
          {contact.serviceOptions.map((opt, i) => {
            const checked = services.includes(opt.value as ServiceValue);
            return (
              <label key={opt.value} className={styles.chip} data-checked={checked}>
                <input
                  type="checkbox"
                  name="services"
                  value={opt.value}
                  checked={checked}
                  data-field={i === 0 ? 'services' : undefined}
                  onChange={() => toggleService(opt.value as ServiceValue)}
                />
                <span className={styles.chipBox} aria-hidden="true" />
                {opt.label}
              </label>
            );
          })}
        </div>
        {errors.services && (
          <p id={id('services-error')} className={styles.error}>
            {errorText(errors.services)}
          </p>
        )}
      </fieldset>

      <div className={styles.field} data-invalid={!!errors.message}>
        <label htmlFor={id('message')}>{contact.fields.message}</label>
        <textarea
          id={id('message')}
          data-field="message"
          name="message"
          rows={5}
          required
          maxLength={3000}
          placeholder={contact.fields.messagePlaceholder}
          value={values.message}
          onChange={(e) => handleChange('message', e.target.value)}
          onBlur={() => handleBlur('message')}
          aria-invalid={!!errors.message}
          aria-describedby={describedBy('message')}
        />
        {errors.message && (
          <p id={id('message-error')} className={styles.error}>
            {errorText(errors.message)}
          </p>
        )}
      </div>

      {/* Honeypot — invisible to people, tempting to bots */}
      <div className={styles.hp} aria-hidden="true">
        <label htmlFor={id('company')}>Company</label>
        <input
          id={id('company')}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div className={styles.submitRow}>
        <Button type="submit" size="lg" disabled={status === 'sending'} magnetic>
          {status === 'sending' ? contact.sending : contact.submit}
        </Button>
        <p className={styles.privacy}>
          {contact.privacy}{' '}
          <a href="/privacy" className={styles.privacyLink}>
            מדיניות פרטיות
          </a>
        </p>
      </div>
    </form>
  );
}
