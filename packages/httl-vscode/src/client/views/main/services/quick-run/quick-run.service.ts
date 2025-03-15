
export class QuickRunService {

  constructor(
    private scriptRunner: { run: (script: string, source: string) => Promise<void> }
  ) { }

  public async runScript({ script }: { script: string }) {
    await this.scriptRunner.run(script, 'quick-run::script');
  }
}