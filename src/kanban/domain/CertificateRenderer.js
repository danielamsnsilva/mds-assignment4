const WIDTH = 1600;
const HEIGHT = 1000;
const MARGIN = 60;

/**
 * H14: draws the completion certificate on a canvas, using the design-system
 * colours and fonts, and downloads it as a PNG.
 */
export class CertificateRenderer {
  constructor(doc = document) {
    this.document = doc;
  }

  /** Reads design tokens from the page, with fallbacks. */
  readTheme() {
    const styles = getComputedStyle(this.document.documentElement);
    const token = (name, fallback) => (styles.getPropertyValue(name) || '').trim() || fallback;
    return {
      background: token('--color-bg', '#f2f2f3'),
      ink: token('--color-text', '#17243b'),
      accent: token('--color-accent', '#4a6d8c'),
      dark: token('--color-accent-900', '#1d2d3d'),
      muted: token('--color-neutral-700', '#555'),
      headingFont: token('--font-heading', 'sans-serif'),
      bodyFont: token('--font-body', 'sans-serif'),
    };
  }

  /**
   * @param {{ name: string, xp: number, level: number, rank: string, badges: string[], pathLabel: string }} data
   * @returns {Promise<Blob | null>}
   */
  async render(data) {
    try {
      await this.document.fonts.ready;
    } catch {
      // Draw with fallback fonts.
    }
    const theme = this.readTheme();
    const canvas = this.document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const ctx = canvas.getContext('2d');

    drawFrame(ctx, theme);
    const centered = (text, font, color, y) => {
      ctx.font = font;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.fillText(text, WIDTH / 2, y);
    };

    centered('FLOW/LAB', `600 40px ${theme.headingFont}`, theme.ink, 170);
    centered('CERTIFICATE OF COMPLETION', `500 26px ${theme.bodyFont}`, theme.accent, 225);
    const nameSize = fitFontSize(ctx, data.name, theme.headingFont);
    centered(data.name, `600 ${nameSize}px ${theme.headingFont}`, theme.ink, 385);
    centered('completed the interactive field manual on Kanban and flow metrics', `400 30px ${theme.bodyFont}`, theme.muted, 450);

    [
      [`${data.xp} XP`, 'experience'],
      [`Level ${data.level}`, 'level'],
      [data.rank, 'rank'],
    ].forEach(([value, label], i) => {
      const x = WIDTH / 2 + (i - 1) * 420;
      ctx.textAlign = 'center';
      ctx.font = `600 60px ${theme.headingFont}`;
      ctx.fillStyle = theme.dark;
      ctx.fillText(value, x, 610);
      ctx.font = `400 22px ${theme.bodyFont}`;
      ctx.fillStyle = theme.muted;
      ctx.fillText(label, x, 650);
    });

    centered(
      data.badges.length ? `Badges: ${data.badges.join(' · ')}` : 'No badges earned yet',
      `500 28px ${theme.bodyFont}`,
      theme.ink,
      760,
    );
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    centered(`${data.pathLabel} · ${date}`, `400 22px ${theme.bodyFont}`, theme.muted, 880);

    return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  }

  async download(data) {
    const blob = await this.render(data);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = this.document.createElement('a');
    link.href = url;
    link.download = CertificateRenderer.fileName(data.name);
    this.document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  static fileName(name) {
    const slug = name
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return `flowlab-certificate-${slug || 'learner'}.png`;
  }
}

function drawFrame(ctx, theme) {
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.strokeStyle = theme.accent;
  ctx.lineWidth = 2;
  ctx.strokeRect(MARGIN, MARGIN, WIDTH - 2 * MARGIN, HEIGHT - 2 * MARGIN);
  const corners = [
    [MARGIN, MARGIN],
    [WIDTH - MARGIN, MARGIN],
    [MARGIN, HEIGHT - MARGIN],
    [WIDTH - MARGIN, HEIGHT - MARGIN],
  ];
  corners.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.moveTo(x - 18, y);
    ctx.lineTo(x + 18, y);
    ctx.moveTo(x, y - 18);
    ctx.lineTo(x, y + 18);
    ctx.stroke();
  });
}

/** Shrinks long names so they fit inside the frame. */
function fitFontSize(ctx, text, fontFamily) {
  let size = 96;
  ctx.font = `600 ${size}px ${fontFamily}`;
  while (size > 40 && ctx.measureText(text).width > WIDTH - 260) {
    size -= 4;
    ctx.font = `600 ${size}px ${fontFamily}`;
  }
  return size;
}
