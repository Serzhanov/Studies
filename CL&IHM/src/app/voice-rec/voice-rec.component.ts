import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
declare const annyang: any;
@Component({
  selector: 'app-voice-rec',
  templateUrl: './voice-rec.component.html',
  styleUrls: ['./voice-rec.component.scss']
})
export class VoiceRecComponent implements OnInit {
  voiceActiveSectionDisabled: boolean = true;
	voiceActiveSectionError: boolean = false;
	voiceActiveSectionSuccess: boolean = false;
	voiceActiveSectionListening: boolean = false;
	voiceText: any;
  @Input() interupt:boolean=false;
  @Output() speech = new EventEmitter<string>();
  constructor(private ngZone: NgZone) { }
  ngOnInit(): void {

  }
  initializeVoiceRecognitionCallback(): void {
		annyang.addCallback('error', (err: { error: string; }) => {
      if(err.error === 'network'){
        this.voiceText = "Internet is require";
        annyang.abort();
        this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
        console.log(err)
      } else if (this.voiceText === undefined) {
				this.ngZone.run(() => this.voiceActiveSectionError = true);
				annyang.abort();
        console.log(err)
			}
		});

		annyang.addCallback('soundstart', () => {
      console.log('start')
      this.voiceActiveSectionListening = true
      this.ngZone.run(() => this.voiceActiveSectionListening = true);
		});

		annyang.addCallback('end', () => {
      if (this.voiceText === undefined) {
        console.log('end')
        this.ngZone.run(() => this.voiceActiveSectionError = true);
				annyang.abort();
        this.voiceActiveSectionError = true
			}
		});

		annyang.addCallback('result', (userSaid: any[]) => {
      console.log("USER SAID",userSaid)
      console.log("user is stop saying")
			this.ngZone.run(() => this.voiceActiveSectionError = false);
			let queryText: any = userSaid[0];
			annyang.abort();
      this.voiceText = queryText;
      this.sendSpeech()
      this.forInterruptCheck();
			this.ngZone.run(() => this.voiceActiveSectionListening = false);
      this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
      this.voiceActiveSectionDisabled=true

		});
	}

	startVoiceRecognition(): void {
    this.voiceActiveSectionDisabled = false;
		this.voiceActiveSectionError = false;
		this.voiceActiveSectionSuccess = false;
    this.voiceText = undefined;

		if (annyang) {
			let commands = {
				'demo-annyang': () => { }
			};

			annyang.addCommands(commands);

      this.initializeVoiceRecognitionCallback();

			annyang.start({ autoRestart: false });

      this.voiceActiveSectionListening = true
      this.forInterruptCheck()
		}
	}

	closeVoiceRecognition(): void {
    this.voiceActiveSectionDisabled = true;
		this.voiceActiveSectionError = false;
		this.voiceActiveSectionSuccess = false;
		this.voiceActiveSectionListening = false;
		this.voiceText = undefined;

		if(annyang){
      annyang.abort();
    }
	}
  sendSpeech(){
    this.speech.emit(this.voiceText)
  }
  forInterruptCheck(){
    if(this.interupt){
      this.voiceActiveSectionDisabled = true;
      this.voiceActiveSectionError = false;
      this.voiceActiveSectionSuccess = false;
      this.voiceActiveSectionListening = false;
      this.voiceText = undefined;
    }
  }
}
