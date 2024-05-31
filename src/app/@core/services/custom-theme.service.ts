import { Injectable } from '@angular/core';
import { devuiDarkTheme, devuiLightTheme } from 'ng-devui/theme';
import * as Color from 'color';
import { ColorHierarchyMap } from './color-hierarchy';

type HslModelKey = 'h' | 's' | 'l' | 'a' | 'sp' | 'lp' | 'ap';
type HsvModelKey = 'h' | 's' | 'v' | 'a' | 'sp' | 'vp' | 'ap';

interface IColorOffset {
  hsl?: { [p in HslModelKey]?: number; };
  hsv?: { [p in HsvModelKey]?: number; };
}

interface IModeOffset {
  mode: 'hsl' | 'hsv',
  offset: ISingleOffset,
}

type ISingleOffset = { [p in HslModelKey]?: number } | { [p in HsvModelKey]?: number };

interface IColorObject {
  colorName?: string;
  color?: Color;
  extends?: Color;
  offset?: IColorOffset;
}

interface IColorHierarchy {
  [colorName: string]: {
    default?: string;
    extends?: string;
    dependency?: string | Array<string>;
    offset?: {
      hsl?: { [p in HslModelKey]?: number; };
      hsv?: { [p in HsvModelKey]?: number; };
    };
  };
}

export interface IThemeData {
  [colorName: string]: string;
}

interface IColorDef {
  colorName?: string;
  color?: string;
}

// hsl | hsv | 浓郁 | 柔和 | 轻快 | 对比 |
type Mode = 'hsl' | 'hsv' | 'strong' | 'soft' | 'light' | 'contrast';

@Injectable()
export class CustomThemeService {
  colorHierarchy: any = ColorHierarchyMap;
  lightThemeData = devuiLightTheme.data;
  darkThemeData = devuiDarkTheme.data;

  public genThemeData(colorChanges: Array<IColorDef>, dark = false, mode?: Mode): IThemeData {
    const themeData = dark ? this.darkThemeData : this.lightThemeData;
    const pattern = this.genColorPattern(this.colorHierarchy, themeData);
    const updatedPattern = this.updateColor(colorChanges, pattern, mode);
    this.fillEmptyColor(updatedPattern, mode);
    return this.pattern2ThemeData(updatedPattern);
  }

  private updateColor(colorChanges: Array<IColorDef>, colorHierarchy: IColorHierarchy, mode?: Mode) {
    const changeKeys = colorChanges.map((change) => change.colorName);
    const changeStack = [...changeKeys];
    const colorKeys = Object.keys(colorHierarchy);
    const pattern = JSON.parse(JSON.stringify(colorHierarchy)) as IColorHierarchy;
    let count = 0;
    while (changeStack.length) {
      const handleKey = changeStack.splice(0, 1).pop()!;
      if (count < changeKeys.length) {
        pattern[handleKey].default = colorChanges[count].color;
      } else {
        const extendsKey = pattern[handleKey].extends!;
        const extendsColor = this.getColor(pattern[extendsKey]['default']!);
        const colorOffset = pattern[handleKey].offset;
        const modeOffset = this.getColorModeOffset(extendsColor, colorOffset, mode);
        pattern[handleKey].default = this.getHexOrRgba(this.getColorValue(extendsColor, modeOffset));
      }

      colorKeys.forEach((colorName) => {
        if (handleKey === pattern[colorName].extends) {
          if (!(changeStack.indexOf(colorName) > -1) && !(changeKeys.indexOf(colorName) > -1)) {
            // 如果不是changeStackUI经做过标记，或者ChangeKeys直接指定了颜色，则标记为需要更新
            changeStack.push(colorName);
          }
        }
      });
      count++;
    }
    return pattern;
  }

  private fillEmptyColor(pattern: IColorHierarchy, effect: Mode | undefined) {
    const colorKeys = Object.keys(pattern);
    const noColorArray = colorKeys
      .map((colorName) => ({
        colorName: colorName,
        pattern: pattern[colorName],
      }))
      .filter((color) => !color.pattern.default);
    noColorArray.forEach((color) => {
      const handleKey = color.colorName;
      const extendsKey = pattern[handleKey].extends!;
      const extendsColor = this.getColor(pattern[extendsKey].default!);
      const colorOffset = pattern[handleKey].offset;
      const modeOffset = this.getColorModeOffset(extendsColor, colorOffset, effect);
      pattern[handleKey].default = this.getHexOrRgba(this.getColorValue(extendsColor, modeOffset));
    });
  }

  private pattern2ThemeData(pattern: IColorHierarchy): IThemeData {
    const themeData: any = {};
    const colorKeys = Object.keys(pattern);
    colorKeys.forEach((colorName) => {
      themeData[colorName] = pattern[colorName].default;
    });
    return themeData;
  }

  private genColorPattern(colorHierarchy: IColorHierarchy, themeData: IThemeData): IColorHierarchy {
    const pattern: IColorHierarchy = {};
    const offset = this.getThemeOffset(colorHierarchy, themeData);
    offset.forEach((obj) => {
      pattern[obj.colorName!] = {
        ...colorHierarchy[obj.colorName!],
        default: themeData[obj.colorName!],
        offset: obj.offset,
      };
    });
    return pattern;
  }

  private getColor = (v: string): Color => /^rgb/.test(v) ? Color.rgb(v) : Color.hsl(v);

  private getThemeOffset(colorHierarchy: IColorHierarchy, themeData: IThemeData): Array<IColorObject> {
    return Object.keys(colorHierarchy)
      .map(n => {
        return ({
          colorName: n,
          color: this.getColor(themeData[n]),
          extends: this.colorHierarchy[n].extends ? this.getColor(themeData[this.colorHierarchy[n].extends]) : null,
        } as IColorObject);
      })
      .map(c => {
        if (c.extends && c.color) {
          c.offset = {
            hsl: this.getColorOffset(c.color, c.extends, 'hsl'),
            hsv: this.getColorOffset(c.color, c.extends, 'hsv'),
          };
        }
        return c;
      });
  }

  private getColorOffset(target: Color, source: Color, mode: 'hsl' | 'hsv'): ISingleOffset {
    const targetModel = target[mode]();
    const sourceModel = source[mode]();
    const key = mode.split('');
    const offset = {
      [key[0]]: targetModel.red() - sourceModel.red(),
      [key[1]]: targetModel.green() - sourceModel.green(),
      [key[2]]: targetModel.blue() - sourceModel.blue(),
      a: targetModel.alpha() - sourceModel.alpha(),
    };
    const percent = {
      [key[1] + 'p']:
        offset[key[1]] > 0 ? (offset[key[1]] * 100) / (100 - sourceModel.green()) : (offset[key[1]] * 100) / sourceModel.green(),
      [key[2] + 'p']:
        offset[key[2]] > 0 ? (offset[key[2]] * 100) / (100 - sourceModel.blue()) : (offset[key[2]] * 100) / sourceModel.blue(),
      ap: offset.a > 0 ? (offset.a * 100) / (1 - sourceModel.alpha()) : (offset.a * 100) / sourceModel.alpha(),
    };
    return {
      ...offset,
      ...percent,
    };
  }

  private getColorModeOffset(source: Color, colorOffset: IColorOffset | any, effect?: Mode): IModeOffset {
    const r: IModeOffset = {
      mode: 'hsl',
      offset: colorOffset.hsl,
    };
    switch (effect) {
      case 'hsl':
        r.mode = 'hsl';
        r.offset = colorOffset.hsl;
        break;
      case 'hsv':
        r.mode = 'hsv';
        r.offset = colorOffset.hsv;
        break;
      case 'strong':
        r.mode = 'hsl';
        r.offset = {
          ...colorOffset.hsl,
          sp:
            colorOffset?.hsl?.sp! > 0
              ? this.minmax(colorOffset?.hsl?.sp! * 1.3, colorOffset?.hsl?.sp!, 100)
              : colorOffset?.hsl?.sp! * 0.75,
        };
        break;
      case 'soft':
        r.mode = 'hsv';
        r.offset = {
          ...colorOffset.hsv,
          sp:
            colorOffset?.hsv?.sp! > 0
              ? this.minmax(colorOffset?.hsv?.sp! * 1.25, colorOffset?.hsv?.sp!, 100)
              : colorOffset?.hsv?.sp! * 0.5,
        };
        break;
      case 'light':
        r.mode = 'hsl';
        r.offset = {
          ...colorOffset.hsl,
          lp: colorOffset?.hsl?.lp! > 0 ? this.minmax(colorOffset?.hsl?.lp!, colorOffset?.hsl?.lp!, 100) : colorOffset?.hsl?.lp! * 0.2,
        };
        break;
      case 'contrast': // 需要计算后的颜色，未支持
        r.mode = 'hsl';
        r.offset = {
          ...colorOffset.hsl,
        };
        break;
    }
    return r;
  }

  private getColorValue(source: Color, modeOffset: IModeOffset): Color {
    const mode = modeOffset.mode;
    const offset = modeOffset.offset;
    const sourceModel = source[mode]();
    if (mode == 'hsl') {
      const value = {
        h: (sourceModel.red() + offset['h']!) % 360,
        s: offset['sp']! > 0 ? sourceModel.green() + (offset['sp']! * (100 - sourceModel.green())) / 100 : sourceModel.green() + (sourceModel.green() * offset['sp']!) / 100,
        // @ts-ignore
        l: offset['lp']! > 0 ? sourceModel.blue() + (offset['lp']! * (100 - sourceModel.blue())) / 100 : sourceModel.blue() + (sourceModel.blue() * offset['lp']!) / 100,
        a: offset.ap! > 0 ? sourceModel.alpha() + (offset.ap! * (1 - sourceModel.alpha())) / 100 : sourceModel.alpha() + (sourceModel.alpha() * offset.ap!) / 100,
      };
      return Color.hsl([Math.round(value.h), Math.round(value.s), Math.round(value.l), value.a]);
    } else if (mode == 'hsv') {
      const value = {
        h: (sourceModel.red() + offset['h']!) % 360,
        s: offset['sp']! > 0 ? sourceModel.green() + (offset['sp']! * (100 - sourceModel.green())) / 100 : sourceModel.green() + (sourceModel.green() * offset['sp']!) / 100,
        // @ts-ignore
        v: offset['vp']! > 0 ? sourceModel.blue() + (offset['vp']! * (100 - sourceModel.blue())) / 100 : sourceModel.blue() + (sourceModel.blue() * offset['vp']!) / 100,
        a: offset.ap! > 0 ? sourceModel.alpha() + (offset.ap! * (1 - sourceModel.alpha())) / 100 : sourceModel.alpha() + (sourceModel.alpha() * offset.ap!) / 100,
      };
      return Color.hsv([Math.round(value.h), Math.round(value.s), Math.round(value.v), value.a]);
    } else {
      return source;
    }
  }

  private getHexOrRgba(color: Color) {
    if (color.alpha() < 1) {
      const c = color.rgb();
      const [r, g, b, a] = [c.red(), c.green(), c.blue(), c.alpha()];
      return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
    } else {
      return color.hex();
    }
  }

  private minmax(v: number, min: number, max: number) {
    if (v < min) {
      return min;
    }

    if (v > max) {
      return max;
    }

    return v;
  }
}
