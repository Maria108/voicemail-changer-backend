class Carriers {
  constructor(pin = '', text) {
    this.pin = pin;
    this.text = text;
  }
  att() {
    return `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Play digits="ww${this.pin}wwwwwwww4w3w1w3ww*"></Play>
        <Pause length="5"/>
        <Say voice="woman">${this.text}</Say>
        <Play digits="ww#"></Play>
        <Play digits="ww#"></Play>
        <Hangup/>
      </Response>`;
  }
  googlefi() {
    return `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Play digits="w${this.pin}#wwww*4w1w2w2w"></Play>
        <Pause length="4"/>
        <Say voice="woman">${this.text}</Say>
        <Play digits="w#ww1w1w"></Play>
        <Pause length="3" />
        <Hangup/>
      </Response>`;
  }
  mint() {
    return `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Play digits="w*${this.pin}#w*3w2w2"></Play>
        <Pause length="7"/>
        <Say voice="woman">${this.text}</Say>
        <Play digits="ww#"></Play>
        <Play digits="w1"></Play>
        <Hangup/>
      </Response>`;
  }
  sprint() {
    return `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Play digits="w${this.pin}#w3w2w1w1w"></Play>
        <Pause length="6"/>
        <Say voice="woman">${this.text}</Say>
        <Play digits="ww#"></Play>
        <Play digits="ww1"></Play>
        <Hangup/>
      </Response>`;
  }
  tmobile() {
    return `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Play digits="w${this.pin}#w*ww3w2ww2"></Play>
        <Pause length="6"/>
        <Say voice="woman">${this.text}</Say>
        <Play digits="ww#"></Play>
        <Play digits="w1"></Play>
        <Hangup/>
      </Response>`;
  }
  verizon() {
    return `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Play digits="w${this.pin}#www4w3ww*"></Play>
        <Pause length="4"/>
        <Say voice="woman">${this.text}</Say>
        <Play digits="ww#"></Play>
        <Play digits="ww#"></Play>
        <Hangup/>
      </Response>`;
  }
}

export { Carriers };
