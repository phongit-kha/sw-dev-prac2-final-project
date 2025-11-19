import { LibraryUser } from "@interfaces";

interface Props {
  user: LibraryUser;
}

export default function ProfileCard({ user }: Props) {
  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
        Profile
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900">
        {user.name}
      </h1>
      <dl className="mt-6 space-y-4 text-sm text-slate-600">
        <div className="flex justify-between border-b border-slate-100 pb-3">
          <dt className="font-semibold">Email</dt>
          <dd>{user.email}</dd>
        </div>
        {user.tel && (
          <div className="flex justify-between border-b border-slate-100 pb-3">
            <dt className="font-semibold">Phone</dt>
            <dd>{user.tel}</dd>
          </div>
        )}
        <div className="flex justify-between border-b border-slate-100 pb-3">
          <dt className="font-semibold">Role</dt>
          <dd className="capitalize">{user.role}</dd>
        </div>
        {user.createdAt && (
          <div className="flex justify-between">
            <dt className="font-semibold">Created at</dt>
            <dd>{new Date(user.createdAt).toLocaleDateString()}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
