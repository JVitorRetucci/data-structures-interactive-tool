export default function generateRandomId(): string {
  return `#${Math.floor(Math.random() * Date.now())
    .toString(16)
    .slice(0, 6)
    .toString()}`;
}
