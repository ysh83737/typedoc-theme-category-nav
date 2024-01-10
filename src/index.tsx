/* eslint-disable max-classes-per-file */
import fs from 'node:fs';
import path from 'node:path';
import {
  Application,
  DeclarationReflection,
  DefaultTheme,
  DefaultThemeRenderContext,
  JSX,
  Options,
  PageEvent,
  Reflection,
  ReflectionCategory,
  Renderer,
  RendererEvent,
} from 'typedoc';
import IconTheme from './components/IconTheme';
import IconThemeAuto from './components/IconThemeAuto';

function classNames(names: Record<string, boolean | null | undefined>, extraCss?: string) {
  const css = Object.keys(names)
    .filter((key) => names[key])
    .concat(extraCss || '')
    .join(' ')
    .trim()
    .replace(/\s+/g, ' ');
  return css.length ? css : undefined;
}

/**
 * Theme render context.
 * @category Render
 */
export class OverrideThemeContext extends DefaultThemeRenderContext {
  /** The preset toolbar */
  presetToolbar: typeof this.toolbar;

  constructor(theme: DefaultTheme, page: PageEvent<Reflection>, options: Options) {
    super(theme, page, options);

    this.navigation = this.overrideNavigation;

    this.presetToolbar = this.toolbar;
    this.toolbar = this.overrideToolbar;

    // remove footer
    this.footer = () => null as never;
    // remove settings
    this.settings = () => null as never;
  }

  /**
   * The new navigation.
   * - add search component to the top
   * - split by categories
   * @param props
   */
  overrideNavigation(props: PageEvent<Reflection>) {
    const { categories } = props.model.project;
    return (
      <nav class="tsd-navigation">
        <div class="tsd-navigation__toolbar-box">
          { this.presetToolbar(props) }
        </div>
        <div class="tsd-navigation__main">
          <h2 class="tsd-navigation__title">
            <a
              href={this.urlTo(props.project)}
              class={classNames({ current: props.project === props.model })}
            >
              CONTENTS
            </a>
          </h2>
          { categories?.map((item) => this.renderCategory(item, props.model.url as string)) }
        </div>
      </nav>
    );
  }

  /**
   * The new toolbar. Remove search component. Keep original styles.
   * @param props
   */
  overrideToolbar(props: PageEvent<Reflection>) {
    return (
      <header class="tsd-page-toolbar tsd-navigation__header__toolbar">
        <div class="tsd-toolbar-contents container">
          <a href={this.options.getValue('titleLink') || this.relativeURL('index.html')} class="title">
            { props.project.name }
          </a>
          <div class="tsd-navigation__header__toolbar__right">
            <div id="tsd-toolbar-links">
              {
                Object.entries(this.options.getValue('navigationLinks')).map(([label, url]) => (
                  <a href={url}>{label}</a>
                ))
              }
            </div>
            <div id="tsd-navigation-theme" class="tsd-navigation__header__toolbar__theme">
              <div class="theme-normal svg-22">
                <IconTheme />
              </div>
              <div class="theme-os svg-20">
                <IconThemeAuto />
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  /**
   * Render category and its children.
   * @param cat category data
   * @param currentUrl
   */
  renderCategory(cat: ReflectionCategory, currentUrl: string) {
    const { title, children } = cat;
    return (
      <div class="tsd-navigation__category">
        <h2 class="tsd-navigation__category__title">
          <span>{ title }</span>
        </h2>
        <ul class="tsd-navigation__category__links">
          {
            children.map((child) => this.link(child, currentUrl))
          }
        </ul>
      </div>
    );
  }

  link(el: DeclarationReflection, currentUrl: string) {
    const { name, url } = el;
    return (
      <li>
        <a
          href={this.relativeURL(url as string)}
          class={classNames({ current: currentUrl === url, 'tsd-navigation__category__link': true })}
        >
          {name}
        </a>
      </li>
    );
  }
}

/**
 * The theme.
 * @category Theme
 */
export class OverrideTheme extends DefaultTheme {
  private contextCache?: OverrideThemeContext;

  public constructor(renderer: Renderer) {
    super(renderer);

    // Copy assets to output directory when the doc render ended.
    this.listenTo(this.owner, RendererEvent.END, (event: RendererEvent) => {
      const sourceAssets = path.resolve(__filename, '../assets');
      fs.cpSync(
        sourceAssets,
        path.join(event.outputDirectory, 'assets'),
        { force: true, recursive: true },
      );
    });
  }

  override getRenderContext(pageEvent: PageEvent<Reflection>): OverrideThemeContext {
    this.contextCache ||= new OverrideThemeContext(
      this,
      pageEvent,
      this.application.options,
    );
    return this.contextCache;
  }
}

export function load(app: Application) {
  // insert stylesheet
  app.renderer.hooks.on(
    'head.end',
    (context): JSX.Element => (
      <link
        rel='stylesheet'
        href={context.relativeURL('assets/style/category-nav.css')}
      />
    ),
  );

  // insert javascript
  app.renderer.hooks.on(
    'body.end',
    (context): JSX.Element => (
      <script src={context.relativeURL('assets/lib/category-nav.js')} />
    ),
  );
  app.renderer.defineTheme('navigation', OverrideTheme);
}
