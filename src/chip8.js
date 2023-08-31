
class Chip8{
    #memory;
    #registers;
    #pc;
    #Ireg;
    #stack;
    #display;
    #opcode;
    #sp;
    #key;
    #delay_timer;
    #sound_timer;
    #draw_flag;

    static #WIDTH  = 64;
    static #HEIGHT = 32;
    static #KEYBOARD =  ["Digit1","Digit2","Digit3","Digit4", //scan codes for keypad
                        "KeyQ", "KeyW","KeyE","KeyR",
                        "KeyA", "KeyS","KeyD","KeyF",
                        "KeyZ", "KeyX","KeyC","KeyV",]
    static FONT = new Uint8Array([                            // default font
      0xF0, 0x90, 0x90, 0x90, 0xF0,
      0x20, 0x60, 0x20, 0x20, 0x70,
      0xF0, 0x10, 0xF0, 0x80, 0xF0,
      0xF0, 0x10, 0xF0, 0x10, 0xF0,
      0x90, 0x90, 0xF0, 0x10, 0x10,
      0xF0, 0x80, 0xF0, 0x10, 0xF0,
      0xF0, 0x80, 0xF0, 0x90, 0xF0,
      0xF0, 0x10, 0x20, 0x40, 0x40,
      0xF0, 0x90, 0xF0, 0x90, 0xF0,
      0xF0, 0x90, 0xF0, 0x10, 0xF0,
      0xF0, 0x90, 0xF0, 0x90, 0x90,
      0xE0, 0x90, 0xE0, 0x90, 0xE0,
      0xF0, 0x80, 0x80, 0x80, 0xF0,
      0xE0, 0x90, 0x90, 0x90, 0xE0,
      0xF0, 0x80, 0xF0, 0x80, 0xF0,
      0xF0, 0x80, 0xF0, 0x80, 0x80
   ]);

   constructor(program){
    this.#memory = [...Chip8.FONT];
    this.#memory[512-1] = 0;
    this.#memory = [...this.#memory, ...program];
    this.#pc = 512;
    this.#registers = [];
    this.initRegisters();
    this.#Ireg = 0;
    this.#delay_timer = 0;
    this.#sound_timer = 0;
    this.#stack = [];
    this.#display = [];
    this.#sp = 0;
   }

   initRegisters(){
    for (let i = 0; i <= 0xf; i++) {
        this.#registers[i] = 0;
        
    }
    
   }
   loadGame(){
    
   }
   decode(){
     this.#opcode = (this.#memory[this.#pc] << 8 ) | (this.#memory[this.#pc +1]);
     let x = (this.#opcode & 0x0f00) >> 8;
     let y = (this.#opcode & 0x00f0) >> 4;
    let nn = (this.#opcode & 0x00ff) 
     switch (this.#opcode & 0xf000) {
        case 0xa000:
            this.#Ireg = this.#opcode & 0x0fff;
            this.#pc +=2;
            break;
        case 0x1000:
            this.#pc = this.#opcode & 0x0fff;
            this.#pc += 2;
            break;
        case 0x2000:
            this.#stack[this.#sp] = this.#pc;
            ++this.#sp;
            this.#pc = this.#opcode & 0x0fff;
            break;
        case 0x3000:
            if(this.#registers[x] === nn)
                this.#pc += 4;
            else
                this.#pc += 2;
            break;
        case 0x4000:
            this.#pc += (this.#registers[x] !== nn) ? 4 : 2;
            break;
        case 0x5000:
            this.#pc += (this.#registers[x] === this.#registers[y]) ? 4:2;
            break;
        case 0x6000:
            this.#registers[x] = nn;
            this.#pc += 2;
            break;
        case 0x7000:
            this.#registers[x] += nn;
            this.#pc += 2 ;
            break;
        case 0x8000:
            switch (0x000f & this.#opcode) {
                case 0x0000:
                    this.#registers[x] = this.#registers[y];
                    this.#pc += 2;
                    break;
                case 0x0001:
                    this.#registers[x] = this.#registers[x] | this.#registers[y];
                    this.#pc += 2;
                    break;
                case 0x0002:
                    this.#registers[x] = this.#registers[x] & this.#registers[y];
                    this.#pc +=2;
                    break;
                case 0x0003:
                    this.#registers[x] = this.#registers[x] ^ this.#registers[y];
                    this.#pc +=2;
                    break;
                case 0x0004:
                    this.#registers[x] += this.#registers[y];
                    if (this.#registers[y] > (0xff - this.#registers[x])) {
                        this.#registers[0xf] = 1;
                    }
                    else
                        this.#registers[0xf] = 0;
                    this.#pc += 2;
                    break;
                case 0x0005:
                    this.#registers[x] -= this.#registers[y];
                    if(this.#registers[y] > this.#registers[x]){
                        this.#registers[0xf] = 0;
                    }
                    else{
                        this.#registers[0xf] = 1;}
                    break;
                case 0x0006:
                    this.#registers[0xf] = this.#registers[x] & 0x1;
                    this.#registers[x] >>= 1;
                    this.#pc += 2;
                    break;
                case 0x0007:
                    if (this.#registers[y] < this.#registers[x]) {
                        this.#registers[0xf] = 0;
                    } else {
                        this.#registers[0xf] = 1;
                    }
                    this.#registers[x] = this.#registers[y] - this.#registers[x];
                    this.#pc +=2;
                    break;
                case 0x000E:
                    this.#registers[0xf] = this.#registers[x] >> 7;
                    this.#registers <<= 1;
                    this.#pc +=2;
                    break;
                default:
                    break;
            }
            break;
        case 0x9000:
            this.#pc += (this.#registers[x] != this.#registers[y]) ? 4:2;
            break;
        case 0xb000:
            this.#pc = this.#registers[0] + (this.#opcode & 0xfff);
            break;
        case 0xc000:
            this.#registers[x] = (Math.random() % ( 0xff + 1)) & (this.#opcode & 0x00ff);
            this.#pc += 2;
            break;
        case 0xd000:
            {
                let x = this.#registers[(this.#opcode & 0x0f00) >> 8];
                let y = this.#registers[(this.#opcode & 0x00f0) >> 4];
                let h = this.#opcode & 0x000f;
                let pixel;
                this.#registers[0xf] = 0;
                for (let Yi = 0; Yi < h; Yi++) {
                    pixel = this.#memory[this.#Ireg + Yi];
                    for (let Xi = 0; Xi < 8; Xi++) {
                        if((pixel & (0x80 >> Xi)) != 0){
                            if(this.#display[(x +Xi + ((y + Yi) * 64))] == 1){
                                this.#registers[0xF] = 1;
                            }
                            this.#display[x + Xi + ((y +Yi) * 64)] ^=1;
                        }   
                    }
                }
                this.#pc+=2;
                this.#draw_flag = 1;
            }
            break;
        case 0x000e:
            switch (0x00f0 & this.#opcode) {
                case 0x0090:
                    if(Chip8.#KEYBOARD[this.#registers[x]] === 1){
                        this.#pc +=2;
                    }
                    break;
                case 0x00A0:
                    if(Chip8.#KEYBOARD[this.#registers[x]] === 0){
                        this.#pc += 2;
                    }
                    break;
                default:
                    break;
            }
            break;
        case 0xf000:
            switch (0x00ff & this.#opcode) {
                case 0x0007:
                    this.#registers[x] = this.#delay_timer;
                    this.#pc += 2;
                    break;
                case 0x000a:
                    if(Chip8.#KEYBOARD.includes(0)){
                        this.#registers[x] = Chip8.#KEYBOARD.indexOf(0);
                    }else  
                        this.#pc +=2;
                    break;
                case 0x0015:
                    this.#delay_timer = this.#registers[x];
                    this.#pc +=2;
                    break;
                case 0x0018:
                    this.#sound_timer = this.#registers[x];
                    this.#pc += 2;
                    break;
                case 0x001e:
                    if (this.#Ireg + this.#registers[x] > 0xfff) {
                        this.#registers[0xf] = 1;
                    } else {
                        this.#registers[0xf] = 0;
                    }
                    this.#Ireg = this.#Ireg + this.#registers[x];
                    this.#pc += 2;
                    break;
                case 0x0029:
                    this.#Ireg = this.#registers[x] * 0.5;
                    this.#pc +=2;
                    break;
                case 0x0033:
                    this.#memory[this.#Ireg] = this.#registers / 100;
                    this.#memory[this.#Ireg + 1] = (this.#registers[x] / 10) % 10;
                    this.#memory[this.#Ireg + 2] = (this.#registers[x] % 10);
                    this.#pc += 2;
                    break;
                case 0x0055:
                    for (let index = 0; index <= x; index++) {
                         this.#memory[this.#Ireg + index] = this.#registers[this.#Ireg + index];       
                    }
                    this.#pc += 2;
                    break;
                case 0x0065:
                    for (let i = 0; i <= x; i++) {
                        this.#registers[i] = this.#memory[this.#Ireg + i];
                        
                    }
                    this.#pc += 2;
                    break;
                default:
                    break;
            }
            break;
        case 0x0000:
            switch (0x0ff & this.#opcode) {
                case 0x00e0:  // double check
                    for (let i = 0; i < 2048; i++) {
                        this.#display[i] = 0;
                    }
                    this.#draw_flag = 1;
                    this.#pc += 2;
                    break;
                case 0x00ee:
                    --this.#sp;
                    this.#pc = this.#stack[this.#sp];
                    this.#pc += 2;
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
     }
     if( this.#delay_timer > 0){
        --this.#delay_timer;
     }
     if (this.#sound_timer > 0) {
        if(this.#sound_timer === 1){
            
        }
        --this.#sound_timer;
     }
   }
}

export default Chip8