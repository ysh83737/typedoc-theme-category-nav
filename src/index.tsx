/* eslint-disable max-classes-per-file */
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
} from 'typedoc';

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
 * @category render
 */
export class OverrideThemeContext extends DefaultThemeRenderContext {
  constructor(theme: DefaultTheme, page: PageEvent<Reflection>, options: Options) {
    super(theme, page, options);

    this.navigation = this.overrideNavigation;
  }

  overrideNavigation(props: PageEvent<Reflection>) {
    const { categories } = props.model.project;
    return (
      <nav class="tsd-navigation">
        <a
          href={this.urlTo(props.project)}
          class={classNames({ current: props.project === props.model })}
        >
          目录
        </a>
        { categories?.map((item) => this.renderCategory(item, props.model.url as string)) }
      </nav>
    );
  }

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
          class={classNames({ current: currentUrl === url })}
        >
          {name}
        </a>
      </li>
    );
  }
}

/**
 * The theme.
 * @category theme
 */
export class OverrideTheme extends DefaultTheme {
  private contextCache?: OverrideThemeContext;

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
  app.renderer.defineTheme('navigation', OverrideTheme);
}
