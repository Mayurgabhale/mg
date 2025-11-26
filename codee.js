labelTextColor: function (context) {
  const text = context.text;   // current tooltip line text

  // If this line is about Offline AND value > 0 → red
  if (
    text.includes("Offline Camera") ||
    text.includes("Offline Controller") ||
    text.includes("Offline Server") ||
    text.includes("Offline Archiver")
  ) {
    const value = parseInt(text.split(":")[1].trim());

    if (value > 0) {
      return "red";   // only offline count > 0
    }
  }

  // Everything else stays white
  return "#ffffff";
}