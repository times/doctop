declare module 'archieml' {
  interface IArchieML {
    load(content: string, options?: { comments?: boolean }): any;
  }

  let archieml: IArchieML;

  export = archieml;
}
