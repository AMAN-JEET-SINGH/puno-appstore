import Link from "next/link";

export default function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="section-head">
      <h2 className="section-title">{title}</h2>
      <Link href={href} className="section-more">see more &raquo;</Link>
    </div>
  );
}
