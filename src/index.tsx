/* eslint-disable max-classes-per-file */
import {
  Application,
  DefaultTheme,
  PageEvent,
  Reflection,
  DefaultThemeRenderContext,
  Options,
} from 'typedoc';

export class OverrideThemeContext extends DefaultThemeRenderContext {
  constructor(theme: DefaultTheme, page: PageEvent<Reflection>, options: Options) {
    super(theme, page, options);
    const { navigation } = this;
    this.navigation = navigation;
  }
}

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
