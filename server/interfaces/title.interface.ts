export interface ITitle extends Document {
  title: string;
  created: string;
  status: string;
  prompt: string;
  clean_title: string;
  is_active?: boolean;
  is_system?: boolean;
  styles?:{
    reasonWhy: ITitleVarient,
    twoPart: ITitleVarient,
    challengingBelief: ITitleVarient
  }
  tones?:{
    optimistic: ITitleVarient,
    motivational: ITitleVarient,
    assertive: ITitleVarient,
  }
}
export interface ITitleVarient extends Document {
  title: string;
  created: string;
  status: string;
}