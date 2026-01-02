/**
 * Creates a "slug" from a string, supporting both Farsi and English.
 */
function slugify(string: string): string {
  const a =
    "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
  const b =
    "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------";
  const p = new RegExp(a.split("").join("|"), "g");

  return (
    string
      .toString()
      .toLowerCase() // Handles any English text
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, "-and-") // Replace & with 'and'

      // --- THIS IS THE FIX ---
      // Keep \w (A-Za-z0-9_), hyphens, AND all Arabic script characters
      // The 'u' flag is essential for Unicode regex.
      .replace(/[^\w\-\p{Script=Arabic}]+/gu, "")
      // ---

      .replace(/\-\-+/g, "-") // Collapse multiple hyphens
      .replace(/^-+/, "") // Trim start
      .replace(/-+$/, "") // Trim end
  );
}

export default slugify;
