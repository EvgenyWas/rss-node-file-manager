export default function clear() {
  process.stdout.write("\x1Bc");
}
