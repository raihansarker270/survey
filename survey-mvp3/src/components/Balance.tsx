export function Balance({ points }: { points: number }) {
  const dollars = (points / 100).toFixed(2);
  return (
    <div className="card flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-300">Current Balance</div>
        <div className="text-3xl font-semibold">{points} pts</div>
      </div>
      <div className="badge">${dollars} USD</div>
    </div>
  );
}
