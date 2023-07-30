import * as Tokgen from 'tokgen';
import * as Parser from 'rss-parser';

const parser = new Parser();
const token = (size?: number) => {
  const generator = new Tokgen({ chars: '0-9a-f', length: size || 12 });
  return generator.generate();
};
export class UtilController {
  constructor() { }
  public token(size?: number): string {
    const generator = new Tokgen({ chars: '0-9a-f', length: size || 12 });
    return generator.generate();
  }

  public async doAsyncWith(callback) {
    const cb = await callback();
    return cb;
  }
  public timePromise(timeout, callback) {
    return new Promise((resolve, reject) => {
        // Set up the timeout
        const timer = setTimeout(() => {
            reject(new Error(`Promise timed out after ${timeout} ms`));
        }, timeout);

        // Set up the real work
        callback(
            (value) => {
                clearTimeout(timer);
                resolve(value);
            },
            (error) => {
                clearTimeout(timer);
                reject(error);
            }
        );
    });
}
public async timeAsyncPromise(timeout, callback) {
    return new Promise(async (resolve, reject) => {
        // Set up the timeout
        const timer = setTimeout(() => {
            reject(new Error(`Promise timed out after ${timeout} ms`));
        }, timeout);

        // Set up the real work
        callback(
            async(value) => {
                clearTimeout(timer);
                resolve(value);
            },
            async(error) => {
                clearTimeout(timer);
                reject(error);
            }
        );
    });
  }

  public renameKey(object, key, newKey) {
    const clonedObj = this.clone(object);
    const targetKey = clonedObj[key];
    delete clonedObj[key];
    clonedObj[newKey] = targetKey;
    return clonedObj;
  }
  public delay(callback, time: number) {
    setTimeout(() => {
      console.log(this.token(5), 'starting');
      callback();
    }, time || 0);
  }
  public transform(value: number, format: string = 'HH:MM:SS'): string {
    const milToSec = Math.floor(value * .001);
    const secNum = parseInt(milToSec.toString(), 10); // don't forget the second param
    let hours: number | string = Math.floor(secNum / 3600);
    let minutes: number | string = Math.floor((secNum - (hours * 3600)) / 60);
    let seconds: number | string = secNum - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = '0' + hours; }
    if (minutes < 10) { minutes = '0' + minutes; }
    if (seconds < 10) { seconds = '0' + seconds; }
    return hours + ':' + minutes + ':' + seconds;
  }
  private clone(obj) {
    return { ...obj };
  }
  public updateAtIndex(source: any[], content: { index: number, change: string; }): any[] {
    if (content.index > source.length) {
      source.push(content.change);
    }
    const newUpdate = source.map((text, i) => {
      // console.log(speaker._id === id, speaker._id.toString(), id);
      if (i === content.index) {
        text = content.change;
      }
      return text;
    });
    return newUpdate;
  }
  public removeAtIndex(source: any[], index: number): any[] {
    source.splice(index, 1);
    return source;
  }
}

