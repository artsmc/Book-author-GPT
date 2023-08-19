import * as Tokgen from 'tokgen';
import * as Parser from 'rss-parser';
import { ISpeakerSort, ISplitLines } from '../interfaces/transcript.interface';

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
public flattenTranscriptAt(speakerArr: ISpeakerSort[], startAt: number, size?: number): string[] {
    let returnString = '';
    const theStart = startAt || 0;
    const returnStrings = [];
    const groupstring = [];
    const characterSplit = 1000;
    const characterLimit = size || 5000;
    let characterCount = 0;
    speakerArr.forEach((speaker: ISpeakerSort, index) => {
      if (speaker.start_time >= theStart / 1000) {
        const splitContext = this.splitLineValues(characterSplit, speaker.transcript).splitStringMap.map((script, i) => {
          const part = `${i + 1}/${this.splitLineValues(characterSplit, speaker.transcript).count}`;
          return `${speaker.speaker_label}\u0020\u0020${this.transform(speaker.dictionary[script.locationStart].start_time)}\u0020\u0020${script.text}\u0020\u0020\u0020`;
        });
        splitContext.forEach(bubble => {
          groupstring.push(bubble);
        });
      }
    });
    groupstring.forEach((context, i) => {
      if (context.length + characterCount < characterLimit) {
        returnString += `${context}\n`;
        characterCount += context.length;
      } else {
        returnStrings.push(returnString);
        characterCount = context.length;
        returnString = `${context}\n\n`;
      }
      if (i === groupstring.length - 1 && context.length + characterCount < characterLimit) {
        returnString += `${context}\n\n`;
        returnStrings.push(returnString);
        characterCount = 0;
      }
    });
    // returnStrings.forEach((chunk, i) => fs.writeFileSync(path.join('./', `/uploads/chunk-${i++}.json`), chunk));
    const uniqueArray = returnStrings.filter((item, pos, self) => {
      return self.indexOf(item) == pos;
    });
    return uniqueArray;
}
public buildFlatTranscript(speakers, startAt: number): string {
    let flatTranscript = '';
    const theStart = startAt || 0;
    speakers.forEach(speaker => {
      if (speaker.start_time >= theStart || (speaker.start_time <= theStart && speaker.end_time >= theStart)) {
        flatTranscript += `${speaker.speaker_label}: ${speaker.transcript}`;
      }
    });
    return flatTranscript;
}
public splitLineValues(splitAt, value): ISplitLines {
    let mapLocation = 0;
    const regex = new RegExp('.{1,' + splitAt + '}\\S(?= |$)', 'g');
    const splitString: string[] = value.match(regex) !== null ? value.match(regex) : [' '];
    const splitStringMap = splitString.map((text, i) => {
      const splitText = text.match(/\S+/g);
      if (splitText) {
        const returnVal = { text, locationEnd: splitText.length - 1, locationStart: mapLocation || 0 };
        mapLocation += splitText.length;
        return returnVal;
      } else {
        return { text: '', locationEnd: 0, locationStart: 0 };
      }
    });
    return { count: splitString.length, splitStringMap };
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
  public splitFlatText(splitAt, value) {
    const regex = new RegExp('.{1,' + splitAt + '}\\S(?= |$)', 'g');
    const splitString: string[] = value.match(regex) !== null ? value.match(regex) : [' '];
    const splitStringMap = splitString.map((text, i) => {
      const returnVal = { text };
      return returnVal;
    });
    return { count: splitString.length, splitStringMap };
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
  public returnNato(A: string): string {
    const letterMap = {
      A: 1,
      B: 2,
      C: 3,
      D: 4,
      E: 5,
      F: 6,
      G: 7,
      H: 8,
      I: 9,
      J: 10,
      K: 11,
      L: 12,
      M: 13,
      N: 14,
      O: 15,
      P: 16,
      Q: 17,
      R: 18,
      S: 19,
      T: 20
    };
    return `Speaker ${letterMap[A.toUpperCase()]}` || null;
  }
  public removeAtIndex(source: any[], index: number): any[] {
    source.splice(index, 1);
    return source;
  }
  public splitFlatTextClean(splitAt: number, value: string) {
        const regex = new RegExp(`.{1,${splitAt}}\\S(?= |$)`, 'g');
        const splitString: string[] = value.match(regex) || [' '];
        const splitStringMap = splitString.map(text => ({ text }));
        return { count: splitString.length, splitStringMap };
    }
}

