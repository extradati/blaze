import * as DocumentPicker from "expo-document-picker";

/** Lets the user pick a file; returns its text, or null if cancelled. */
export async function pickTextFile(): Promise<string | null> {
  const res = await DocumentPicker.getDocumentAsync({ type: ".gpx,application/gpx+xml" });
  if (res.canceled) return null;
  return res.assets[0].file!.text();
}
