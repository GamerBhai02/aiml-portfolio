export default function EmptyState({ message = 'Nothing here yet — check back soon.' }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">&#9670;</span>
      <p>{message}</p>
    </div>
  );
}
