import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { errorMessage } from '@/api/client';
import {
  createCvEntry,
  deleteCvEntry,
  getAbout,
  updateAbout,
  updateCvEntry,
  type AboutData,
  type AboutInput,
  type Certification,
  type CvKind,
  type Education,
  type Position,
} from '@/api/site';
import { AssetPicker } from '@/components/asset-picker';
import { LinesInput } from '@/components/lines-input';
import { TagInput } from '@/components/tag-input';
import { useToast } from '@/components/toast';

const PROFILE_EMPTY: AboutInput = {
  fullName: '',
  profileMd: '',
  location: '',
  contactEmail: '',
};

export function AboutEditorPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data, isLoading } = useQuery({ queryKey: ['about'], queryFn: getAbout });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['about'] });

  if (isLoading || !data) {
    return (
      <div className="page">
        <h1 className="page-h1">About / CV</h1>
        <p className="muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-h1">About / CV</h1>
      <ProfileSection data={data} onSaved={invalidate} toast={toast} />
      <PositionsSection positions={data.positions} onChanged={invalidate} toast={toast} />
      <EducationSection education={data.education} onChanged={invalidate} toast={toast} />
      <CertificationsSection
        certifications={data.certifications}
        onChanged={invalidate}
        toast={toast}
      />
    </div>
  );
}

type Toast = ReturnType<typeof useToast>;

function ProfileSection({
  data,
  onSaved,
  toast,
}: {
  data: AboutData;
  onSaved: () => void;
  toast: Toast;
}) {
  const [form, setForm] = useState<AboutInput>(PROFILE_EMPTY);
  const [avatarId, setAvatarId] = useState<string | null>(null);

  useEffect(() => {
    setForm({
      fullName: data.about.fullName,
      profileMd: data.about.profileMd,
      location: data.about.location,
      contactEmail: data.about.contactEmail,
      seoTitle: data.about.seoTitle ?? undefined,
      seoDescription: data.about.seoDescription ?? undefined,
    });
    setAvatarId(data.about.avatarAssetId);
  }, [data]);

  const set = <K extends keyof AboutInput>(key: K, value: AboutInput[K]) =>
    setForm((c) => ({ ...c, [key]: value }));

  const save = useMutation({
    mutationFn: () => updateAbout({ ...form, avatarAssetId: avatarId ?? undefined }),
    onSuccess: () => {
      onSaved();
      toast('Profile saved');
    },
    onError: (err) => toast(errorMessage(err, 'Save failed.'), 'error'),
  });

  return (
    <section className="cv-section">
      <div className="cv-section-head">
        <h2>Profile</h2>
        <button className="btn primary" disabled={save.isPending} onClick={() => save.mutate()}>
          Save profile
        </button>
      </div>
      <div className="cv-grid-2">
        <label className="stacked">
          <span>Full name</span>
          <input value={form.fullName} onChange={(e) => set('fullName', e.target.value)} />
        </label>
        <label className="stacked">
          <span>Location</span>
          <input value={form.location} onChange={(e) => set('location', e.target.value)} />
        </label>
      </div>
      <label className="stacked">
        <span>Contact email</span>
        <input value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} />
      </label>
      <label className="stacked">
        <span>Profile (markdown)</span>
        <textarea
          rows={4}
          value={form.profileMd}
          onChange={(e) => set('profileMd', e.target.value)}
        />
      </label>
      <label className="stacked">
        <span>Avatar</span>
        <AssetPicker value={avatarId} onChange={setAvatarId} />
      </label>
    </section>
  );
}

/**
 * A date the API will accept for @IsDateString: an ISO calendar date that also
 * refers to a real day (2025-02-30 parses as a string but is not a date).
 */
function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

/** Generic add/edit/delete list for a CV entity kind. */
function CvList<T extends { id: string; sortOrder: number }>({
  title,
  kind,
  items,
  onChanged,
  toast,
  makeEmpty,
  renderFields,
  summarize,
  missingRequired,
}: {
  title: string;
  kind: CvKind;
  items: T[];
  onChanged: () => void;
  toast: Toast;
  makeEmpty: (sortOrder: number) => Omit<T, 'id'>;
  renderFields: (draft: Omit<T, 'id'>, update: (patch: Partial<T>) => void) => React.ReactNode;
  summarize: (item: T) => string;
  /** Labels of fields the API requires that this draft has not filled in yet. */
  missingRequired: (draft: Omit<T, 'id'>) => string[];
}) {
  const [editing, setEditing] = useState<{ id: string | null; draft: Omit<T, 'id'> } | null>(null);

  const save = useMutation({
    mutationFn: ({ id, draft }: { id: string | null; draft: Omit<T, 'id'> }) =>
      id ? updateCvEntry<T>(kind, id, draft) : createCvEntry<T>(kind, draft),
    onSuccess: () => {
      onChanged();
      setEditing(null);
      toast('Saved');
    },
    onError: (err) => toast(errorMessage(err, 'Save failed.'), 'error'),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteCvEntry(kind, id),
    onSuccess: () => {
      onChanged();
      toast('Deleted');
    },
    onError: () => toast('Delete failed.', 'error'),
  });

  const startNew = () => setEditing({ id: null, draft: makeEmpty(items.length) });

  const missing = editing ? missingRequired(editing.draft) : [];

  return (
    <section className="cv-section">
      <div className="cv-section-head">
        <h2>{title}</h2>
        <button className="btn small" onClick={startNew}>
          Add
        </button>
      </div>

      <div className="cv-list">
        {items.map((item) => (
          <div key={item.id} className="cv-item">
            <span className="cv-item-summary">{summarize(item)}</span>
            <div className="cv-item-actions">
              <button
                className="btn ghost small"
                onClick={() => {
                  const draft = { ...item } as Partial<T>;
                  delete draft.id;
                  setEditing({ id: item.id, draft: draft as Omit<T, 'id'> });
                }}
              >
                Edit
              </button>
              <button
                className="btn ghost small danger"
                onClick={() => {
                  if (confirm('Delete this entry?')) {
                    remove.mutate(item.id);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="muted small">None yet.</p>}
      </div>

      {editing && (
        <div className="cv-editor">
          {renderFields(editing.draft, (patch) =>
            setEditing((cur) => (cur ? { ...cur, draft: { ...cur.draft, ...patch } } : cur)),
          )}
          <div className="cv-editor-actions">
            {missing.length > 0 && (
              <span className="field-error">Required: {missing.join(', ')}</span>
            )}
            <button className="btn" onClick={() => setEditing(null)}>
              Cancel
            </button>
            <button
              className="btn primary"
              disabled={save.isPending || missing.length > 0}
              onClick={() => save.mutate(editing)}
            >
              Save entry
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function PositionsSection({
  positions,
  onChanged,
  toast,
}: {
  positions: Position[];
  onChanged: () => void;
  toast: Toast;
}) {
  return (
    <CvList<Position>
      title="Work history"
      kind="positions"
      items={positions}
      onChanged={onChanged}
      toast={toast}
      summarize={(p) => `${p.title} · ${p.company}`}
      missingRequired={(p) => [
        ...(p.title.trim() === '' ? ['role title'] : []),
        ...(p.company.trim() === '' ? ['company'] : []),
        ...(isCalendarDate(p.startDate) ? [] : ['start date (YYYY-MM-DD)']),
      ]}
      makeEmpty={(sortOrder) => ({
        company: '',
        companyUrl: null,
        title: '',
        description: '',
        location: '',
        logoAssetId: null,
        startDate: '',
        endDate: null,
        bullets: [],
        skills: [],
        sortOrder,
      })}
      renderFields={(draft, update) => (
        <>
          <div className="cv-grid-2">
            <label className="stacked">
              <span>Role title</span>
              <input value={draft.title} onChange={(e) => update({ title: e.target.value })} />
            </label>
            <label className="stacked">
              <span>Company</span>
              <input value={draft.company} onChange={(e) => update({ company: e.target.value })} />
            </label>
          </div>
          <div className="cv-grid-2">
            <label className="stacked">
              <span>Company URL</span>
              <input
                value={draft.companyUrl ?? ''}
                onChange={(e) => update({ companyUrl: e.target.value || null })}
              />
            </label>
            <label className="stacked">
              <span>Location</span>
              <input
                value={draft.location}
                onChange={(e) => update({ location: e.target.value })}
              />
            </label>
          </div>
          <div className="cv-grid-2">
            <label className="stacked">
              <span>Start date (YYYY-MM-DD)</span>
              <input
                value={draft.startDate}
                onChange={(e) => update({ startDate: e.target.value })}
              />
            </label>
            <label className="stacked">
              <span>End date (blank = present)</span>
              <input
                value={draft.endDate ?? ''}
                onChange={(e) => update({ endDate: e.target.value || null })}
              />
            </label>
          </div>
          <label className="stacked">
            <span>Blurb</span>
            <input
              value={draft.description}
              onChange={(e) => update({ description: e.target.value })}
            />
          </label>
          <label className="stacked">
            <span>Bullets (one per line)</span>
            <LinesInput value={draft.bullets} onChange={(bullets) => update({ bullets })} />
          </label>
          <div className="cv-grid-2">
            <label className="stacked">
              <span>Skills</span>
              <TagInput value={draft.skills} onChange={(skills) => update({ skills })} />
            </label>
            <label className="stacked">
              <span>Sort order</span>
              <input
                type="number"
                value={draft.sortOrder}
                onChange={(e) => update({ sortOrder: Number(e.target.value) })}
              />
            </label>
          </div>
          <label className="stacked">
            <span>Logo</span>
            <AssetPicker
              value={draft.logoAssetId}
              onChange={(logoAssetId) => update({ logoAssetId })}
            />
          </label>
        </>
      )}
    />
  );
}

function EducationSection({
  education,
  onChanged,
  toast,
}: {
  education: Education[];
  onChanged: () => void;
  toast: Toast;
}) {
  return (
    <CvList<Education>
      title="Education"
      kind="education"
      items={education}
      onChanged={onChanged}
      toast={toast}
      summarize={(e) => `${e.degree} ${e.field} · ${e.institution}`}
      missingRequired={(e) => [
        ...(e.institution.trim() === '' ? ['institution'] : []),
        ...(e.degree.trim() === '' ? ['degree'] : []),
        ...(isCalendarDate(e.startDate) ? [] : ['start date (YYYY-MM-DD)']),
      ]}
      makeEmpty={(sortOrder) => ({
        institution: '',
        degree: '',
        field: '',
        location: '',
        logoAssetId: null,
        startDate: '',
        endDate: null,
        notes: '',
        sortOrder,
      })}
      renderFields={(draft, update) => (
        <>
          <div className="cv-grid-2">
            <label className="stacked">
              <span>Degree</span>
              <input value={draft.degree} onChange={(e) => update({ degree: e.target.value })} />
            </label>
            <label className="stacked">
              <span>Field</span>
              <input value={draft.field} onChange={(e) => update({ field: e.target.value })} />
            </label>
          </div>
          <div className="cv-grid-2">
            <label className="stacked">
              <span>Institution</span>
              <input
                value={draft.institution}
                onChange={(e) => update({ institution: e.target.value })}
              />
            </label>
            <label className="stacked">
              <span>Location</span>
              <input
                value={draft.location}
                onChange={(e) => update({ location: e.target.value })}
              />
            </label>
          </div>
          <div className="cv-grid-2">
            <label className="stacked">
              <span>Start date</span>
              <input
                value={draft.startDate}
                onChange={(e) => update({ startDate: e.target.value })}
              />
            </label>
            <label className="stacked">
              <span>End date</span>
              <input
                value={draft.endDate ?? ''}
                onChange={(e) => update({ endDate: e.target.value || null })}
              />
            </label>
          </div>
          <label className="stacked">
            <span>Notes / thesis</span>
            <input value={draft.notes} onChange={(e) => update({ notes: e.target.value })} />
          </label>
          <label className="stacked">
            <span>Sort order</span>
            <input
              type="number"
              value={draft.sortOrder}
              onChange={(e) => update({ sortOrder: Number(e.target.value) })}
            />
          </label>
        </>
      )}
    />
  );
}

function CertificationsSection({
  certifications,
  onChanged,
  toast,
}: {
  certifications: Certification[];
  onChanged: () => void;
  toast: Toast;
}) {
  return (
    <CvList<Certification>
      title="Certifications"
      kind="certifications"
      items={certifications}
      onChanged={onChanged}
      toast={toast}
      summarize={(c) => `${c.name} · ${c.issuer}`}
      missingRequired={(c) => [
        ...(c.name.trim() === '' ? ['name'] : []),
        ...(c.issuer.trim() === '' ? ['issuer'] : []),
        ...(isCalendarDate(c.issuedDate) ? [] : ['issued date (YYYY-MM-DD)']),
      ]}
      makeEmpty={(sortOrder) => ({
        name: '',
        issuer: '',
        description: '',
        logoAssetId: null,
        issuedDate: '',
        expiresDate: null,
        credentialUrl: null,
        sortOrder,
      })}
      renderFields={(draft, update) => (
        <>
          <div className="cv-grid-2">
            <label className="stacked">
              <span>Name</span>
              <input value={draft.name} onChange={(e) => update({ name: e.target.value })} />
            </label>
            <label className="stacked">
              <span>Issuer</span>
              <input value={draft.issuer} onChange={(e) => update({ issuer: e.target.value })} />
            </label>
          </div>
          <label className="stacked">
            <span>Description</span>
            <input
              value={draft.description}
              onChange={(e) => update({ description: e.target.value })}
            />
          </label>
          <div className="cv-grid-2">
            <label className="stacked">
              <span>Issued (YYYY-MM-DD)</span>
              <input
                value={draft.issuedDate}
                onChange={(e) => update({ issuedDate: e.target.value })}
              />
            </label>
            <label className="stacked">
              <span>Expires (blank = none)</span>
              <input
                value={draft.expiresDate ?? ''}
                onChange={(e) => update({ expiresDate: e.target.value || null })}
              />
            </label>
          </div>
          <div className="cv-grid-2">
            <label className="stacked">
              <span>Credential URL</span>
              <input
                value={draft.credentialUrl ?? ''}
                onChange={(e) => update({ credentialUrl: e.target.value || null })}
              />
            </label>
            <label className="stacked">
              <span>Sort order</span>
              <input
                type="number"
                value={draft.sortOrder}
                onChange={(e) => update({ sortOrder: Number(e.target.value) })}
              />
            </label>
          </div>
        </>
      )}
    />
  );
}
