import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { errorMessage } from '@/api/client';
import { getSiteConfig, updateSiteConfig, type SiteConfig } from '@/api/site';
import { useToast } from '@/components/toast';

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

  const { data } = useQuery({ queryKey: ['config'], queryFn: getSiteConfig });

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
