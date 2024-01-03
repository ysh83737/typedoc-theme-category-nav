import {
  Application,
  DefaultTheme,
  PageEvent,
  Reflection,
  DefaultThemeRenderContext,
  Options,
} from "typedoc";

export function load(app: Application) {
  app.renderer.defineTheme("navigation", OverrideTheme);
}

export class OverrideTheme extends DefaultTheme {
  private _contextCache?: OverrideThemeContext;

  override getRenderContext(pageEvent: PageEvent<Reflection>): OverrideThemeContext {
    this._contextCache ||= new OverrideThemeContext(
      this,
      pageEvent,
      this.application.options,
    );
    return this._contextCache;
  }
}

export class OverrideThemeContext extends DefaultThemeRenderContext {
  constructor(theme: DefaultTheme, page: PageEvent<Reflection>, options: Options) {
    super(theme, page, options);
    const _navigation = this.navigation;
    this.navigation = _navigation;
  }
}
