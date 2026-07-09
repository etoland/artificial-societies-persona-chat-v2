function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({
  name,
  color,
  size = 40,
}: {
  name: string;
  color: string;
  size?: number;
}) {
  return (
    <div
      className="flex items-center justify-center rounded-full font-medium shrink-0"
      style={{
        width: size,
        height: size,
        background: `${color}1f`,
        color,
        fontSize: size * 0.36,
      }}
    >
      {initials(name)}
    </div>
  );
}
