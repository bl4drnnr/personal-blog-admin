import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { errorMessage } from '@/api/client';
import {
  getMaintenance,
  getSiteConfig,
  updateMaintenance,
  updateSiteConfig,
  type SiteConfig,
} from '@/api/site';
import { LoadingBlock } from '@/components/loader';
import { useToast } from '@/components/toast';

/** The deploy switch: instant, separate from the Save button below it. */
function MaintenanceCard() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data } = useQuery({ queryKey: ['maintenance'], queryFn: getMaintenance });

  const toggle = useMutation({
    mutationFn: (enabled: boolean) => updateMaintenance(enabled),
    onSuccess: (state) => {
      queryClient.setQueryData(['maintenance'], state);
      toast(state.enabled ? 'Maintenance mode is on' : 'The site is live again');
    },
    onError: (err) => toast(errorMessage(err, 'Toggling maintenance failed.'), 'error'),
  });

  if (!data) {
    return null;
  }

  const flip = () => {
    if (
      data.enabled ||
      confirm('Take the public site down? Every visitor will be redirected to /maintenance.')
    ) {
      toggle.mutate(!data.enabled);
    }
  };

  return (
    <div className={`maintenance-card${data.enabled ? ' on' : ''}`}>
      <div>
        <span className="field-label">Maintenance mode</span>
        <p className="maintenance-status">
          {data.enabled
            ? 'The public site is down — every page redirects to /maintenance.'
            : 'The public site is live.'}
        </p>
      </div>
      <button
        className={`btn${data.enabled ? ' primary' : ' danger'}`}
        disabled={toggle.isPending}
        onClick={flip}
      >
        {data.enabled ? 'Bring the site back' : 'Enable maintenance'}
      </button>
    </div>
  );
}

const EMPTY: SiteConfig = {
  heroTitle: '',
  heroIntroMd: '',
  socialLinks: [],
  seoDefaultTitle: '',
  seoDefaultDescription: '',
  footerText: '',
};

export function SiteSettingsPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [form, setForm] = useState<SiteConfig>(EMPTY);

  const { data, isLoading } = useQuery({ queryKey: ['config'], queryFn: getSiteConfig });

  useEffect(() => {
    if (data) {
      setForm(data);
    }
  }, [data]);

  const set = <K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const save = useMutation({
    mutationFn: () => updateSiteConfig(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] });
      toast('Saved');
    },
    onError: (err) => toast(errorMessage(err, 'Save failed.'), 'error'),
  });

  const setLink = (index: number, key: 'label' | 'url', value: string) =>
    set(
      'socialLinks',
      form.socialLinks.map((link, i) => (i === index ? { ...link, [key]: value } : link)),
    );

  // The API validates every social link with @IsUrl; catch it here so the
  // button explains the problem instead of the request failing after the fact.
  const invalidLinks = form.socialLinks
    .map((link, index) => ({ link, index }))
    .filter(({ link }) => !/^https?:\/\/\S+\.\S+/.test(link.url.trim()));

  if (isLoading) {
    return (
      <div className="page">
        <h1 className="page-h1">Site settings</h1>
        <LoadingBlock label="Loading settings…" />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-head-row">
        <h1 className="page-h1">Site settings</h1>
        <button
          className="btn primary"
          disabled={save.isPending || invalidLinks.length > 0}
          onClick={() => save.mutate()}
        >
          Save
        </button>
      </div>

      <MaintenanceCard />

      <label className="stacked">
        <span>Hero title</span>
        <textarea
          rows={2}
          value={form.heroTitle}
          onChange={(e) => set('heroTitle', e.target.value)}
        />
      </label>

      <label className="stacked">
        <span>Hero intro (markdown)</span>
        <textarea
          rows={3}
          value={form.heroIntroMd}
          onChange={(e) => set('heroIntroMd', e.target.value)}
        />
      </label>

      <div className="stacked">
        <span className="field-label">Social links</span>
        <div className="social-links">
          {form.socialLinks.map((link, index) => (
            <div key={index} className="social-row">
              <input
                placeholder="label"
                value={link.label}
                onChange={(e) => setLink(index, 'label', e.target.value)}
              />
              <input
                placeholder="https://…"
                value={link.url}
                aria-invalid={invalidLinks.some((l) => l.index === index)}
                onChange={(e) => setLink(index, 'url', e.target.value)}
              />
              <button
                className="btn ghost small danger"
                onClick={() =>
                  set(
                    'socialLinks',
                    form.socialLinks.filter((_, i) => i !== index),
                  )
                }
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="btn small"
            onClick={() => set('socialLinks', [...form.socialLinks, { label: '', url: '' }])}
          >
            Add link
          </button>
        </div>
      </div>

      <label className="stacked">
        <span>Default SEO title</span>
        <input
          value={form.seoDefaultTitle}
          onChange={(e) => set('seoDefaultTitle', e.target.value)}
        />
      </label>

      <label className="stacked">
        <span>Default SEO description</span>
        <textarea
          rows={2}
          value={form.seoDefaultDescription}
          onChange={(e) => set('seoDefaultDescription', e.target.value)}
        />
      </label>

      <label className="stacked">
        <span>Footer text</span>
        <input value={form.footerText} onChange={(e) => set('footerText', e.target.value)} />
      </label>
    </div>
  );
}
