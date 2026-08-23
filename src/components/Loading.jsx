export default function Loading({ full = false }) {
  return (
    <div className={full ? 'loading full' : 'loading'}>
      <div className="spinner" />
    </div>
  );
}
