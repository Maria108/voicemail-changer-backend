class Carriers {
  constructor(pin = '', text) {
    this.pin = pin;
    this.text = text;
  }
  mint() {
    return `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
          <Play digits="w*${this.pin}#w*3w2w2"></Play>
          <Pause length="7"/>
          <Say voice="woman">${this.text}</Say>
          <Play digits="ww#"></Play>
          <Play digits="w1"></Play>
      </Response>`;
  }
}

export { Carriers };
