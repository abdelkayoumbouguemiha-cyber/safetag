import { getUnactivatedBracelets } from "@/actions/admin";
import PrintGrid from "./print-grid";

export default async function PrintCodesPage() {
  const { bracelets } = await getUnactivatedBracelets();

  return <PrintGrid bracelets={bracelets} />;
}
