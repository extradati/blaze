import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";

/** Lets the user pick a file; returns its text, or null if cancelled. */
export async function pickTextFile(): Promise<string | null> {
  // GPX has no MIME type Android/iOS reliably know, so accept any file and validate by parsing.
  const res = await DocumentPicker.getDocumentAsync({ type: "*/*", copyToCacheDirectory: true });
  if (res.canceled) return null;
  return new File(res.assets[0].uri).text();
}
