// ═══════════════════════════════════════════════════════════
// llms.txt — Wegweiser für LLM-Crawler
// ═══════════════════════════════════════════════════════════
// Wird aus DB-Inhalten generiert statt statisch gepflegt, damit die Datei
// nicht veraltet. Format nach llmstxt.org: H1, Blockquote, thematische
// H2-Abschnitte mit Linklisten.

import { getAllContent } from '$lib/server/db/queries/content';
import { getPublishedBlogPosts } from '$lib/server/db/queries/blog';
import {
	defaultPillars,
	defaultKeynotes,
	defaultFaq,
	mergeContent
} from '$lib/server/content-defaults';
import { buildSiteIdentity } from '$lib/config/site-identity';
import type { PillarsContent, KeynotesContent, FaqContent } from '$lib/types/content';

/** Mehrzeiligen Text auf eine Zeile bringen — Linklisten vertragen keine Umbrüche. */
function oneLine(text: string): string {
	return text.replace(/\s+/g, ' ').trim();
}

/** Markdown-Auszeichnung entfernen; llms.txt soll Fliesstext liefern. */
function plain(text: string): string {
	return oneLine(text)
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/[*_`#>]/g, '');
}

const STATIC_PAGES: Array<{ path: string; label: string; note: string }> = [
	{
		path: '/transformation',
		label: 'Transformation',
		note: 'IT-, Digital- und KI-Strategie in Stufen, die einzeln bestehen — für Geschäftsleitungen.'
	},
	{
		path: '/governance',
		label: 'Governance & Verwaltungsrat',
		note: 'Digitale Urteilskraft im Gremium, Verantwortung nach OR 716a.'
	},
	{
		path: '/keynotes',
		label: 'Keynotes & Lehre',
		note: 'Vorträge und Workshops zu KI, Governance und digitaler Urteilskraft.'
	},
	{
		path: '/manifest',
		label: 'Manifest',
		note: 'Haltung und Arbeitsweise.'
	},
	{
		path: '/experimentierraum',
		label: 'Experimentierraum',
		note: 'Eigene Plattformen, KI-Agenten und Infrastruktur — selbst gebaut und betrieben.'
	},
	{
		path: '/impulse',
		label: 'Impulse',
		note: 'Beiträge aus der Praxis zu KI-Agenten, IT-Strategie und Verwaltungsratsarbeit.'
	}
];

/**
 * Kurzform: Struktur der Site plus Kurzfassung der Inhalte.
 */
export async function buildLlmsTxt(siteUrl: string): Promise<string> {
	const identity = buildSiteIdentity(siteUrl);
	const [content, posts] = await Promise.all([getAllContent(), getPublishedBlogPosts()]);

	const pillars = mergeContent<PillarsContent>(defaultPillars, content.pillars).pillars;
	const keynotes = mergeContent<KeynotesContent>(defaultKeynotes, content.keynotes).items;
	const faq = mergeContent<FaqContent>(defaultFaq, content.faq).items;

	const today = new Date().toISOString().slice(0, 10);
	const upcoming = keynotes
		.filter((k) => (k.endDate ?? k.date) >= today)
		.sort((a, b) => a.date.localeCompare(b.date));

	const out: string[] = [];

	out.push(`# ${identity.orgName} — ${identity.personName}`);
	out.push('');
	out.push(`> ${plain(identity.personDescription)}`);
	out.push('');
	out.push(
		`${identity.orgName} ist eine inhabergeführte IT- und KI-Strategieberatung mit Sitz in ${identity.orgLocality} BE, Schweiz. ` +
			`Schwerpunkt: strategische Begleitung von Geschäftsleitungen und Verwaltungsräten bei IT-, Digitalisierungs- und KI-Fragen. ` +
			`Kanonische Domain: ${siteUrl}`
	);
	out.push('');

	out.push('## Person');
	out.push('');
	out.push(`- Name: ${identity.personName}`);
	out.push(`- Rolle: ${identity.personJobTitle}, Inhaberin ${identity.orgName}`);
	for (const c of identity.personCredentials ?? []) {
		out.push(`- Abschluss: ${c.name}${c.year ? ` (${c.year})` : ''}`);
	}
	for (const a of identity.personAffiliations ?? []) {
		out.push(`- Mandat/Tätigkeit: ${a.name} (${a.url})`);
	}
	for (const url of identity.personSameAs) {
		out.push(`- Profil: ${url}`);
	}
	out.push('');

	out.push('## Leistungen');
	out.push('');
	for (const p of pillars) {
		const url = p.subpageUrl ? siteUrl + p.subpageUrl : `${siteUrl}/#pillars`;
		out.push(`- [${plain(p.title)}](${url}): ${plain(p.desc)}`);
	}
	out.push('');

	out.push('## Seiten');
	out.push('');
	for (const p of STATIC_PAGES) {
		out.push(`- [${p.label}](${siteUrl}${p.path}): ${p.note}`);
	}
	out.push('');

	if (upcoming.length) {
		out.push('## Kommende Auftritte');
		out.push('');
		for (const k of upcoming) {
			const host = k.event ? `${k.event}, ` : '';
			out.push(`- ${k.date} — ${plain(k.title)} (${host}${plain(k.location)})`);
		}
		out.push('');
	}

	if (posts.length) {
		out.push('## Impulse');
		out.push('');
		out.push('Jeder Beitrag ist zusätzlich als reines Markdown abrufbar: URL + `.md`');
		out.push('');
		for (const post of posts) {
			const date = post.publishDate ? new Date(post.publishDate).toISOString().slice(0, 10) : '';
			const excerpt = plain(post.excerpt ?? '');
			out.push(
				`- [${plain(post.title)}](${siteUrl}/impulse/${post.slug}.md)${date ? ` (${date})` : ''}${excerpt ? `: ${excerpt}` : ''}`
			);
		}
		out.push('');
	}

	if (faq.length) {
		out.push('## Häufige Fragen');
		out.push('');
		for (const item of faq) {
			out.push(`### ${plain(item.question)}`);
			out.push('');
			out.push(plain(item.answer));
			out.push('');
		}
	}

	out.push('## Volltext');
	out.push('');
	out.push(`- [Alle Beiträge im Volltext](${siteUrl}/llms-full.txt)`);
	out.push('');

	out.push('## Rechtliches');
	out.push('');
	out.push(`- [Impressum](${siteUrl}/impressum)`);
	out.push(`- [Datenschutz](${siteUrl}/datenschutz)`);
	out.push(`- [AGB](${siteUrl}/agb)`);
	out.push(`- [Kontakt](${siteUrl}/kontakt)`);
	out.push('');

	return out.join('\n');
}

/**
 * Langform: alle veröffentlichten Beiträge im Volltext (Markdown-Quelle).
 */
export async function buildLlmsFullTxt(siteUrl: string): Promise<string> {
	const identity = buildSiteIdentity(siteUrl);
	const posts = await getPublishedBlogPosts();

	const out: string[] = [];
	out.push(`# ${identity.orgName} — Beiträge im Volltext`);
	out.push('');
	out.push(
		`> Alle veröffentlichten Beiträge von ${identity.personName}. Quelle: ${siteUrl}/impulse`
	);
	out.push('');

	for (const post of posts) {
		const date = post.publishDate ? new Date(post.publishDate).toISOString().slice(0, 10) : '';
		out.push('---');
		out.push('');
		out.push(`## ${post.title}`);
		out.push('');
		out.push(`URL: ${siteUrl}/impulse/${post.slug}`);
		if (date) out.push(`Datum: ${date}`);
		if (post.tags?.length) out.push(`Themen: ${post.tags.join(', ')}`);
		out.push('');
		out.push(post.content.trim());
		out.push('');
	}

	return out.join('\n');
}
