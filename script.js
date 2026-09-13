/* Loop — application logic.
   One class: seed data, runtime state, actions, and renderVals(), which returns
   every value the markup in index.html reads through {{ }}. */

class Component extends DCLogic {
  state = {
    route: 'home', turning: false, q: '', emirate: 'All', cat: 'All',
    xp: 340, streak: 4, done: {}, joined: {}, mood: null,
    m1: null, m2: null, m3: null, matched: false,
    c1: 0, c2: 0, c3: 0, toast: '', botIdx: 0,
    pending: null, sidInput: '', sidError: false, lastSid: '', showSuccess: false,
    surpriseId: null, redeemed: {}, heroMood: 'idle', snubs: 0, uni: 'American University of Sharjah',
    palette: 'newsprint', music: false, track: 'readingroom', intro: false, introStep: 0, gatePct: 0, holding: false, menuOpen: false, view: 'board', calm: false, cuties: [], connected: {}, interest: 'All', attendees: [],
    buddyOpen: false, buddyHidden: false, buddyIdx: 0, poked: 0,
    psAnim: false, psN: [218241, 103, 35], solCard: 0,
    findOpen: null, revealed: {}, pIdx: 0, wIdx: 0, scram: 'DISCOVER', peeling: {}, gone: {}, conIdx: 0,
    saved: {}, friendInput: '', lastFriend: '', lastXp: 25,
    day: 'Tue', scope: 'Everywhere', posted: [],
    pTitle: '', pCat: 'Clubs', pUni: 'American University of Sharjah', pWhen: '', pBlurb: '', pError: false,
    chatInput: '', chat: [{ who: 'bloop', text: 'Hello. I am Bloop. Bleep reads all 412 noticeboards so you do not have to; I just sit here and worry about you. Pick one thing and turn up.' }], dms: [], dmTab: false, dmSeen: true, dmOpenPid: '', tearing: {}, boardBonus: {}, boardDelta: {}, liveFeed: 'Watching 218,241 students do nothing in particular.',
    showSignup: false, signedUp: false, suNameIn: '', suUniIn: 'American University of Sharjah', suMailIn: '', suError: false, suName: '', suUni: ''
  };

  SAVE_KEY = 'loop.session.v1';
  // route is deliberately NOT saved: every visit opens on Home, never mid-site
  SAVED_FIELDS = ['xp', 'streak', 'done', 'joined', 'mood', 'redeemed', 'saved', 'posted', 'connected',
    'dms', 'palette', 'track', 'music', 'calm', 'uni', 'signedUp', 'suName', 'suUni', 'snubs'];

  loadSession() {
    try {
      const raw = window.localStorage.getItem(this.SAVE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      const next = {};
      this.SAVED_FIELDS.forEach((k) => { if (data[k] !== undefined) next[k] = data[k]; });
      // music never resumes on its own: a page that starts making noise is a page people close
      next.music = false;
      delete next.route;
      if (Object.keys(next).length) this.setState(next);
    } catch (e) { /* corrupt or blocked storage: start fresh, silently */ }
  }

  saveSession() {
    try {
      const out = {};
      this.SAVED_FIELDS.forEach((k) => { out[k] = this.state[k]; });
      window.localStorage.setItem(this.SAVE_KEY, JSON.stringify(out));
    } catch (e) { /* private mode or quota: the session just will not persist */ }
  }

  thread(n) {
    const cols = 3;
    const rows = Math.ceil(n / cols);
    const xs = [17, 50, 83];
    const pts = [];
    for (let r = 0; r < rows; r++) {
      const y = ((r + 0.42) / rows) * 100;
      const inRow = Math.min(cols, n - r * cols);
      const order = r % 2 ? xs.slice(0, inRow).reverse() : xs.slice(0, inRow);
      order.forEach((x) => pts.push(x.toFixed(1) + ',' + y.toFixed(1)));
    }
    return pts.join(' ');
  }

  pins(list) {
    return list.map((p, i) => ({
      kind: p.kind, t: p.t, b: p.b, src: p.src,
      r: p.r + 'deg',
      bg: p.bg
    }));
  }

  PROB_PINS = [
    { x: 4,  y: 4,  w: 198, r: -3.2, bg: '#f9f7ef', kind: 'The gap', t: 'Nobody tells you', b: 'Every campus runs a full week of events. Almost none of it reaches the students next door.', src: 'The problem, in one line' },
    { x: 37, y: 2,  w: 190, r: 2.6,  bg: '#7ee0d3', kind: 'Where it hides', t: 'Sixteen group chats', b: 'Listings live in private chats, dead Instagram accounts and expired posters.', src: 'Bloop, complaining' },
    { x: 70, y: 7,  w: 194, r: -2.1, bg: '#ffb37a', kind: 'Who loses', t: 'The quiet ones', b: 'Commuters, transfers and first years hear last, because hearing depends on already knowing people.', src: 'Bleep, agreeing' },
    { x: 8,  y: 46, w: 204, r: 3.4,  bg: '#e6dfc9', kind: 'The cost', t: 'Paid for, unused', b: 'Tuition buys the lectures and the whole campus around them. Most students only collect the lectures.', src: 'Interviews, Jan 2026' },
    { x: 43, y: 49, w: 190, r: -3.8, bg: '#f9f7ef', kind: 'Not the cause', t: 'Not apathy', b: 'Students are not lazy. They are uninformed, which is a different thing and a fixable one.', src: 'Our survey' },
    { x: 73, y: 52, w: 188, r: 2.2,  bg: '#bfe9e1', kind: 'Conclusion', t: 'Not a supply problem', b: 'The events exist. The students exist. They are not being introduced.', src: 'Both bots, in unison' }
  ];

  RES_PINS = [
    { x: 4,  y: 4,  w: 200, r: -2.8, bg: '#f9f7ef', kind: 'Published 01', t: '218,241 students', b: '64,859 started last year, the biggest intake in five years.', src: 'MoHE via WAM, 2026' },
    { x: 37, y: 2,  w: 192, r: 3.1,  bg: '#7ee0d3', kind: 'Published 02', t: '103 institutions', b: 'Around 2,500 programmes, and no route between any two of them.', src: 'MoHE via WAM, 2026' },
    { x: 70, y: 6,  w: 196, r: -1.9, bg: '#ffb37a', kind: 'Published 03', t: '35% international', b: 'They arrive with no local network. "Someone will tell me" is not a plan.', src: 'KHDA, 2024–25' },
    { x: 6,  y: 41, w: 200, r: 2.4,  bg: '#e6dfc9', kind: 'Survey', t: '71% found out late', b: 'Heard about an event only after it had already happened.', src: '148 students, 9 campuses' },
    { x: 39, y: 45, w: 194, r: -3.4, bg: '#f9f7ef', kind: 'Survey', t: '82% would travel', b: 'Would attend at another UAE university if anyone told them it was on.', src: '148 students, 9 campuses' },
    { x: 71, y: 43, w: 190, r: 2.9,  bg: '#ffd6a5', kind: 'Survey', t: '38% joined nothing', b: 'Nothing at all in their entire first year.', src: '148 students, 9 campuses' },
    { x: 20, y: 76, w: 214, r: -2.2, bg: '#bfe9e1', kind: 'Literature', t: '+4 points retention', b: 'Students in extracurriculars stay enrolled at higher rates.', src: 'Univ. of California' },
    { x: 56, y: 78, w: 214, r: 3.6,  bg: '#f9f7ef', kind: 'Free text', t: '"Just tell me"', b: 'Eleven wrote a version of the same sentence. Nobody asked for more events.', src: 'Bloop, reading answers' }
  ];

  SOL_PINS = [
    { x: 4,  y: 4,  w: 198, r: 2.7,  bg: '#7ee0d3', kind: 'Piece 01', t: 'One feed', b: 'Clubs, events, internships and study groups from every campus, filtered three ways.', src: 'Discover' },
    { x: 37, y: 2,  w: 190, r: -3.1, bg: '#f9f7ef', kind: 'Piece 02', t: 'Match me', b: 'Pick two things you like. Bleep stops you scrolling and picks three.', src: 'Match me' },
    { x: 70, y: 7,  w: 192, r: 2.2,  bg: '#ffb37a', kind: 'Piece 03', t: 'Cross-uni by default', b: 'One country, 103 campuses, treated as one community.', src: 'Every page' },
    { x: 6,  y: 44, w: 200, r: -2.5, bg: '#e6dfc9', kind: 'Piece 04', t: 'XP and rewards', b: 'Turning up earns points. Points buy karak, prints and gym passes.', src: 'Redeem' },
    { x: 40, y: 47, w: 194, r: 3.3,  bg: '#f9f7ef', kind: 'Piece 05', t: 'Proof list', b: 'Everything you joined becomes a line you can paste into a CV.', src: 'My desk' },
    { x: 72, y: 50, w: 188, r: -2.8, bg: '#bfe9e1', kind: 'Piece 06', t: 'Check-in', b: 'One tap on how the week is going changes what gets suggested.', src: 'Wellbeing' },
    { x: 26, y: 79, w: 236, r: 1.8,  bg: '#ffd6a5', kind: 'Not doing', t: 'No follower counts', b: 'No public profiles, no fourth place to post. Every extra feature is a reason to close the tab.', src: 'Deliberately' }
  ];

  TILTS = ['-3.5deg', '2.8deg', '-1.6deg', '4.2deg', '-2.4deg', '1.9deg', '-4deg', '3.1deg'];
  MAGNETS = ['#7ee0d3', '#ffb37a', '#f9f7ef', '#e6dfc9', '#ffd6a5', '#bfe9e1'];




  LIVE_VERBS = ['joined a hackathon team', 'ticked a quest', 'turned up to padel', 'posted a listing', 'brought a friend along', 'joined the film club', 'redeemed a karak', 'signed up for Model UN'];

  DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  NAV = [
    { r: 'home', l: 'Home', n: 'start here' },
    { r: 'discover', l: 'Discover', n: 'the feed' },
    { r: 'week', l: 'This week', n: 'what\u2019s on' },
    { r: 'match', l: 'Match me', n: 'ask Bleep' },
    { r: 'campus', l: 'Clubs & events', n: 'by emirate' },
    { r: 'careers', l: 'Careers', n: 'jobs, grants' },
    { r: 'wellbeing', l: 'Wellbeing', n: 'check in' },
    { r: 'dashboard', l: 'My dashboard', n: 'profile, XP' },
    { r: 'board', l: 'Leaderboard', n: 'live' },
    { r: 'redeem', l: 'Redeem', n: 'spend XP' },
    { r: 'post', l: 'Post a listing', n: '+100 XP' },
    { r: 'social', l: 'Connect', n: 'find people' },
    { r: 'problem', l: 'Problem & Solution', n: 'the case' }
  ];

  PEOPLE = [
    { id: 'p1', name: 'Omar H.', year: '2nd year', tags: ['Robotics', 'Padel', 'Terrible at chess'], line: 'Will build anything with a motor in it. Available for padel at short notice.', looking: 'A hackathon team that sleeps' },
    { id: 'p2', name: 'Aisha R.', year: '3rd year', tags: ['Startups', 'Design', 'Karak addict'], line: 'Working on something small and slightly stressful. Wants people to argue with.', looking: 'A co-founder who finishes things' },
    { id: 'p3', name: 'Dana K.', year: '1st year', tags: ['Film', 'Photography', 'Night walks'], line: 'New here, knows four people, two of them are cousins.', looking: 'Anyone doing anything on a Thursday' },
    { id: 'p4', name: 'Yusuf I.', year: 'Masters', tags: ['Data', 'Chess', 'Spreadsheets'], line: 'Genuinely enjoys pivot tables. Please do not make it weird.', looking: 'A study group with standards' },
    { id: 'p5', name: 'Mariam S.', year: '2nd year', tags: ['Volunteering', 'Ceramics', 'Cats'], line: 'Makes wonky bowls on purpose. Runs a beach clean nobody attends.', looking: 'Six people and a bin bag' },
    { id: 'p6', name: 'Rohan M.', year: '4th year', tags: ['Basketball', 'Music', 'Cooking'], line: 'Organises the open run. Will feed you afterwards, within reason.', looking: 'Regulars, not one-offs' },
    { id: 'p7', name: 'Fatima A.', year: '1st year', tags: ['Astronomy', 'Hiking', 'Poetry'], line: 'Owns a telescope, no car. This is the central problem of her life.', looking: 'Someone with a car and patience' },
    { id: 'p8', name: 'Karim N.', year: '3rd year', tags: ['Debate', 'Model UN', 'Blazers'], line: 'Takes it seriously. Knows this. Has made peace with it.', looking: 'A delegation that prepares' },
    { id: 'p9', name: 'Leen A.', year: '2nd year', tags: ['Language swap', 'Baking', 'Board games'], line: 'Fluent in three, mediocre in two more. Brings actual cake.', looking: 'Arabic–Japanese swap partner' },
    { id: 'p10', name: 'Tariq B.', year: 'Masters', tags: ['Wellbeing', 'Running', 'Quiet'], line: 'Runs slowly on purpose so people can talk. It works.', looking: 'Walkers welcome, honestly' }
  ];

  INTERESTS = ['Robotics', 'Startups', 'Design', 'Film', 'Data', 'Volunteering', 'Basketball', 'Padel', 'Astronomy', 'Debate', 'Baking', 'Wellbeing', 'Music', 'Chess', 'Photography'];

  ANSWERS = [
    { k: ['bored', 'nothing to do', 'tonight', 'today', 'what should i do'], a: 'Open This week and tap today. If it is Thursday, brace yourself, that is peak campus chaos.' },
    { k: ['free', 'cheap', 'money', 'broke', 'food', 'pizza'], a: 'Filter Discover by Events and look for the pizza talk. Also: 150 XP gets you free karak on the Redeem page.' },
    { k: ['friend', 'friends', 'lonely', 'alone', 'meet people'], a: 'Language Swap and Board Game Society have the highest talk-to-stranger ratio. Both are low stakes. Bring nobody.' },
    { k: ['job', 'internship', 'cv', 'career', 'employ', 'work'], a: 'Careers page. Apply to the one you feel underqualified for, everyone else feels underqualified too. Your proof list writes the CV line for you.' },
    { k: ['startup', 'founder', 'business', 'idea', 'funding', 'grant'], a: 'Founders table has 3 seats left, and the AED 50k grant clinic will fix your spreadsheet. Bring the spreadsheet.' },
    { k: ['stress', 'sad', 'anxious', 'tired', 'burn', 'overwhelmed', 'sleep'], a: 'Tap Buried on the Wellbeing check-in and I will stop suggesting events until Sunday. Twenty minutes of nothing is a real listing. Counselling needs no appointment.' },
    { k: ['xp', 'points', 'level', 'redeem', 'voucher', 'discount'], a: 'XP comes from joining things (25), bringing someone (35), quests (40–80) and posting a listing (100). Spend it on Redeem.' },
    { k: ['leaderboard', 'rank', 'first', 'top', 'omar'], a: 'Omar Haddad is on 1,480 and climbing while we speak. The board updates live. I would not chase him.' },
    { k: ['club', 'clubs', 'society', 'join'], a: 'There are 36 listings and one Cheese Appreciation Society. I refuse to elaborate. Go look.' },
    { k: ['sport', 'gym', 'padel', 'football', 'basketball', 'run', 'fit'], a: 'Padel at Khalifa is permanently four people short, basketball at Ajman is genuinely mixed level, and the 5km run club allows walking.' },
    { k: ['other uni', 'another uni', 'cross', 'travel', 'far', 'commute', 'metro'], a: 'Two emirates away is about 40 minutes. Your commute to your own campus is 45. Cross-uni is the entire point of me.' },
    { k: ['post', 'organise', 'my event', 'my club', 'advertise'], a: 'Use + Post. Five fields, 100 XP, and it lands in the feed instantly. Mention if there is food, attendance triples.' },
    { k: ['study', 'exam', 'grade', 'assignment', 'gpa', 'quiet'], a: 'Quiet study room at Zayed is enforced silence, and the Calculus rescue group is run by people who also failed it once.' },
    { k: ['sign up', 'signup', 'account', 'register'], a: 'Press the Sign up pill in the nav. Four fields and a joining bonus of 100 XP.' },
    { k: ['who are you', 'bloop', 'bleep', 'what are you', 'robot', 'ai'], a: 'I am Bloop. Bleep does matching and the introductions; I follow you around and answer things. We are not related. He insists we are.' },
    { k: ['creative', 'art', 'music', 'photo', 'film', 'write'], a: 'Ceramics at Ajman, photography walk in old Dubai, poetry open mic at UAQ, and a film club that defends indefensible films.' },
    { k: ['colour', 'color', 'theme', 'dark', 'light'], a: 'Swatch dots, top right of the nav. Six monochrome sets. Paper is the light one, if you are brave.' }
  ];

  DM_LINES = [
    'Thanks for the connect. Still looking for someone for the Thursday thing, you in?',
    'Hey. Are you going to the language swap on Sunday? I need a partner who will actually turn up.',
    'You joined the padel game, right? Tell me honestly how beginner-friendly it is.',
    'Anyone driving to Jebel Jais on Saturday? I have snacks and no car.',
    'There is cake at the baking one. That is the whole message.'
  ];

  DM_FOLLOWUPS = {
    yes: 'Perfect. I will message the details the morning of.',
    where: 'Main building, by the doors, 6pm. I will be the one looking lost.',
    no: 'All good. Next one, then.'
  };

  DM_REPLIES = [
    { label: 'Yes, I am in', key: 'yes' },
    { label: 'Where exactly?', key: 'where' },
    { label: 'Cannot this week', key: 'no' }
  ];

  audioCtx() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    this.actx = this.actx || new AC();
    if (this.actx.state === 'suspended') this.actx.resume();
    return this.actx;
  }

  // three ambiences, all generated in the page: no file to load, no autoplay
  MUSIC_TRACKS = [
    {
      key: 'readingroom', name: 'Reading room',
      cutoff: 460, drift: 170, rate: 0.035, level: 0.06, every: 11000, span: 15, stagger: 0.9,
      chords: [
        [73.42, 146.83, 220, 329.63],
        [65.41, 130.81, 196, 293.66],
        [87.31, 174.61, 261.63, 392],
        [82.41, 164.81, 246.94, 329.63]
      ]
    },
    {
      key: 'nightshift', name: 'Night shift',
      cutoff: 340, drift: 110, rate: 0.021, level: 0.055, every: 15000, span: 21, stagger: 1.8,
      chords: [
        [55, 82.41, 164.81, 246.94],
        [55, 87.31, 174.61, 261.63],
        [49, 73.42, 146.83, 220],
        [55, 98, 196, 293.66]
      ]
    },
    {
      key: 'earlyedition', name: 'Early edition',
      cutoff: 620, drift: 240, rate: 0.055, level: 0.05, every: 8000, span: 11, stagger: 0.55,
      chords: [
        [98, 146.83, 233.08, 349.23],
        [110, 164.81, 261.63, 392],
        [87.31, 130.81, 207.65, 311.13],
        [98, 155.56, 246.94, 369.99]
      ]
    }
  ];

  startMusic(trackKey) {
    const ctx = this.audioCtx();
    if (!ctx) return;
    const track = this.MUSIC_TRACKS.filter((t) => t.key === trackKey)[0] || this.MUSIC_TRACKS[0];
    this.musicTrack = track;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.linearRampToValueAtTime(track.level, ctx.currentTime + 5);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = track.cutoff;
    lp.Q.value = 0.25;
    // slow filter drift, so the pad breathes instead of repeating flat
    const lfo = ctx.createOscillator(), lfoGain = ctx.createGain();
    lfo.frequency.value = track.rate;
    lfoGain.gain.value = track.drift;
    lfo.connect(lfoGain).connect(lp.frequency);
    lfo.start();
    this.musicLfo = lfo;
    lp.connect(master).connect(ctx.destination);
    this.musicBus = master;
    this.musicStep = 0;
    // two slightly detuned sines per note: the beating is what makes it read as a pad
    const voice = (freq, at, dur, level) => {
      [-0.9, 0.9].forEach((cents) => {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.detune.value = cents * 3;
        g.gain.setValueAtTime(0.0001, at);
        g.gain.linearRampToValueAtTime(level, at + dur * 0.45);
        g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
        osc.connect(g).connect(lp);
        osc.start(at);
        osc.stop(at + dur + 0.2);
      });
    };
    const play = () => {
      const chord = track.chords[this.musicStep % track.chords.length];
      const t = ctx.currentTime + 0.05;
      chord.forEach((f, i) => voice(f, t + i * track.stagger, track.span, i === 0 ? 0.3 : 0.17));
      this.musicStep++;
    };
    play();
    this.musicTimer = setInterval(play, track.every);
  }

  stopMusic() {
    clearInterval(this.musicTimer);
    try { if (this.musicLfo) { this.musicLfo.stop(); this.musicLfo = null; } } catch (e) {}
    this.musicTimer = null;
    const bus = this.musicBus;
    if (bus && this.actx) {
      const t = this.actx.currentTime;
      bus.gain.cancelScheduledValues(t);
      bus.gain.setValueAtTime(bus.gain.value, t);
      bus.gain.linearRampToValueAtTime(0.0001, t + 3);
      setTimeout(() => { try { bus.disconnect(); } catch (e) {} }, 3400);
    }
    this.musicBus = null;
  }

  toggleMusic = () => {
    const keys = this.MUSIC_TRACKS.map((t) => t.key);
    const at = this.state.music ? keys.indexOf(this.state.track) : -1;
    const next = at + 1 >= keys.length ? null : keys[at + 1];
    this.stopMusic();
    if (!next) { this.setState({ music: false }); return; }
    this.startMusic(next);
    this.setState({ music: true, track: next });
  };

  blip() {
    if (this.state.calm) return;
    try {
      const ctx = this.audioCtx();
      if (!ctx) return;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1100;
      filter.connect(ctx.destination);
      [[523.25, 0], [392, 0.16]].forEach(function (pair) {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = pair[0];
        const t = ctx.currentTime + pair[1];
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.045, t + 0.07);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.62);
        osc.connect(g).connect(filter);
        osc.start(t);
        osc.stop(t + 0.66);
      });
    } catch (e) { /* audio blocked, the badge still shows */ }
  }

  pushDm(p) {
    const line = this.DM_LINES[this.state.dms.length % this.DM_LINES.length];
    const msg = { pid: p.id, from: p.name, text: line, mine: false, read: false };
    this.setState({ dms: this.state.dms.concat([msg]), dmSeen: false });
    this.blip();
  }

  sendDmReply(r) {
    const pid = this.state.dmOpenPid;
    if (!pid) return;
    this.setState({ dms: this.state.dms.concat([{ pid: pid, from: 'You', text: r.label, mine: true, read: true }]) });
    clearTimeout(this.dmReplyTimer);
    this.dmReplyTimer = setTimeout(() => {
      const last = this.state.dms.filter((d) => d.pid === pid && !d.mine).slice(-1)[0];
      if (!last) return;
      this.setState({
        dms: this.state.dms.concat([{ pid: pid, from: last.from, text: this.DM_FOLLOWUPS[r.key], mine: false, read: true }])
      });
      // no sound while you are sitting in that thread watching it arrive
      if (!(this.state.buddyOpen && this.state.dmTab && this.state.dmOpenPid === pid)) this.blip();
    }, 1400);
  }

  CHAT_CHIPS = ['What\u2019s on today?', 'I know nobody here', 'How do I get XP?', 'Something free?'];

  answerFor(q) {
    const t = q.toLowerCase();
    let best = null;
    let score = 0;
    this.ANSWERS.forEach((row) => {
      let sc = 0;
      row.k.forEach((k) => { if (t.indexOf(k) > -1) sc += k.length; });
      if (sc > score) { score = sc; best = row.a; }
    });
    if (best) return best;
    const shrugs = [
      'No idea. Genuinely. Try Discover and press Surprise me, that is my answer to most things.',
      'I have read 412 listings and none of them cover that. Ask me about food, clubs, XP or being tired.',
      'That is above my pay grade, and I am not paid. Bleep might guess, he loves guessing.'
    ];
    return shrugs[Math.floor(Math.random() * shrugs.length)];
  }

  PEERS = [
    { name: 'Omar Haddad', uni: 'Khalifa University', emirate: 'Abu Dhabi', xp: 1480 },
    { name: 'Aisha Rahman', uni: 'American University of Sharjah', emirate: 'Sharjah', xp: 1265 },
    { name: 'Dana Khoury', uni: 'University of Wollongong in Dubai', emirate: 'Dubai', xp: 1110 },
    { name: 'Yusuf Iqbal', uni: 'BITS Pilani Dubai', emirate: 'Dubai', xp: 940 },
    { name: 'Mariam Saeed', uni: 'Zayed University', emirate: 'Dubai', xp: 720 },
    { name: 'Rohan Menon', uni: 'Ajman University', emirate: 'Ajman', xp: 615 },
    { name: 'Fatima Al Blooshi', uni: 'United Arab Emirates University', emirate: 'Abu Dhabi', xp: 480 },
    { name: 'Karim Nasser', uni: 'American University of Sharjah', emirate: 'Sharjah', xp: 305 },
    { name: 'Leen Abdulla', uni: 'University of Sharjah', emirate: 'Sharjah', xp: 240 },
    { name: 'Tariq Bassam', uni: 'Fujairah University', emirate: 'Fujairah', xp: 150 }
  ];

  PALETTES = [
    { key: 'newsprint', name: 'Morning edition', c: ['#0f0e09', '#1a1811', '#302c1f', '#5d5849', '#938d7b', '#c0baa8'], section: '#e6e0cf', glow: '#dbd4c0', bg: '#f5f2e7', surface: '#ebe6d7', text: '#14120c', light: true, ink: '#14120c', onAccent: '#f5f2e7' },
    { key: 'blueprint', name: 'Blueprint', c: ['#eaf4ff', '#cfe4f7', '#a7cbe8', '#6d9cbe', '#476f8e', '#2c4b63'], section: '#16283a', glow: '#1d3448', bg: '#0d1520', surface: '#141f2e', text: '#e6eef7', ink: '#070d14', onAccent: '#0d1520' },
    { key: 'sandstorm', name: 'Desert edition', c: ['#2a1a0e', '#3d2715', '#5e3a1d', '#8a5a2f', '#b08a5d', '#cfb48c'], section: '#e6d7ba', glow: '#dfcdab', bg: '#f3ead9', surface: '#eadfc7', text: '#241a10', light: true, ink: '#241a10', onAccent: '#f8f2e6' },
    { key: 'mintpress', name: 'Mint press', c: ['#eafaf3', '#cdeede', '#a6dfc9', '#6bb7a0', '#437e6d', '#2a4f45'], section: '#15241e', glow: '#1b3029', bg: '#0f1512', surface: '#16201b', text: '#e8f2ec', ink: '#070b09', onAccent: '#0f1512' },
    { key: 'lateedition', name: 'Late edition', c: ['#f7f4ea', '#efeadd', '#ded7c4', '#9e987f', '#6d6857', '#46423a'], section: '#22201a', glow: '#2c2922', bg: '#12110d', surface: '#1c1a15', text: '#f7f4ea', onAccent: '#12110d' }
  ];

  PROBLEM_CHAT = [
    { who: 'bloop', text: 'Right. What is actually wrong with university life in the UAE?' },
    { who: 'bleep', text: 'Nothing. That is the problem. Today there is a hackathon, a debate open, a padel game four people short and three internship deadlines. Across 103 institutions.' },
    { who: 'bloop', text: 'And nobody knows?' },
    { who: 'bleep', text: 'You know if you follow the right nine Instagram accounts, got added to the right group chat, or sit next to one extremely organised classmate.' },
    { who: 'bloop', text: 'So opportunity gets handed out by who you already know.' },
    { who: 'bleep', text: 'Correct. Which quietly punishes commuters, transfers, mid-year starters and anyone shy. Meanwhile clubs speak to half-empty rooms and conclude nobody cares.' }
  ];

  SOL_CARDS = [
    { icon: 'ph-squares-four', kicker: 'One feed', title: 'Everything in one place', body: 'Clubs, events, competitions, internships, study groups and wellbeing sessions from every campus, filtered by emirate, category and free text.' },
    { icon: 'ph-robot', kicker: 'Match me', title: 'Three, not four hundred', body: 'Three questions and Bleep hands back three suggestions, with the reasoning shown so you can disagree with it.' },
    { icon: 'ph-map-trifold', kicker: 'Cross-uni by default', title: 'The border is the feature', body: 'A Sharjah student sees the Dubai hackathon and the Abu Dhabi talk. 82% of our survey said they would go if they knew, so we tell them.' },
    { icon: 'ph-gift', kicker: 'XP & rewards', title: 'A nudge with a snack attached', body: 'Points for turning up, small quests like "go to one thing at a uni that is not yours", and real student discounts to spend them on. Aimed at the 38% who joined nothing.' },
    { icon: 'ph-seal-check', kicker: 'Proof list', title: 'Your CV, pre-written', body: 'Everything you joined, phrased as a skill instead of a memory. Involvement becomes something you can show, not just something you vaguely did.' },
    { icon: 'ph-pulse', kicker: 'Check-in', title: 'Quiet weeks are allowed', body: 'One tap on how the week is going changes what gets suggested, and pauses your streak instead of guilt-tripping you.' }
  ];

  WHY = [
    { n: '01', title: 'Less luck, more choice', body: 'Right now the internship, the co-founder and the friend all depend on who happened to mention it near you.', stat: 'Proximity is doing a job that should be done by a list.' },
    { n: '02', title: 'Belonging is the real outcome', body: 'Students who take part report stronger belonging and better wellbeing than those who do not.', stat: 'Dropping out is usually social before it is academic.' },
    { n: '03', title: 'Skills you can prove', body: 'The Ministry says graduates need practical skills. Most get built outside lectures.', stat: 'A term of turning up beats a term of scrolling.' },
    { n: '04', title: 'Nothing has to be built', body: 'No new clubs, no new events, no new budget. Only a shared index of what is already running.', stat: 'Cheapest fix available.' }
  ];

  FINDINGS = [
    { stat: '218,241', label: 'students enrolled, and climbing', tells: '64,859 started last year, the biggest intake in five years.', src: 'Ministry of Higher Education & Scientific Research, via WAM, 2026' },
    { stat: '103', label: 'institutions, none of them talking', tells: 'Around 2,500 programmes across 103 campuses. A hundred noticeboards, no shared one.', src: 'Ministry of Higher Education & Scientific Research, via WAM, 2026' },
    { stat: '35%', label: 'international, in Dubai private unis', tells: 'They arrive with no local network. "Someone will tell me" is not a plan for them.', src: 'KHDA / Dubai higher education enrolment data, 2024–25' },
    { stat: '+4pts', label: 'retention for students who join in', tells: 'Students in extracurriculars stay enrolled at higher rates than those who don\u2019t.', src: 'University of California, Extracurricular Participation & Student Success' },
    { stat: 'Why', label: 'belonging is the mechanism', tells: 'Involvement raises belonging and wellbeing, most for the least connected.', src: 'Higher Education Research & Development, 2022; European Journal of Education, 2024' }
  ];

  PERSONAS = [
    { icon: 'ph-backpack', tag: 'First year', who: 'Knows four people', pain: 'Every club she wants formed its friendship groups in week one. The union noticeboard has three posters, all expired.', need: 'Needs somewhere turning up alone is normal.' },
    { icon: 'ph-bus', tag: 'Commuter', who: 'Ninety minutes each way', pain: 'Anything after 6pm costs him two hours of travel, so he skips it, then sees it on Instagram the next morning.', need: 'Needs to know before he decides to stay on campus.' },
    { icon: 'ph-arrows-left-right', tag: 'Transfer', who: 'New university, same city', pain: 'Her old campus had a whole network. None of it carries over, and everyone assumes she already knows how things work.', need: 'Needs cross-campus access so her contacts still count.' },
    { icon: 'ph-briefcase', tag: 'Final year', who: 'Needs a CV, not a hobby', pain: 'Joined nothing for three years. Now applying for graduate schemes with an empty activities section.', need: 'Needs participation that leaves a record.' }
  ];

  SURVEY = [
    { label: 'Heard about an event only after it happened', pct: 71 },
    { label: 'Follow 6+ club accounts to keep up', pct: 64 },
    { label: 'Would cross campuses, if they knew', pct: 82 },
    { label: 'Joined nothing at all in their first year', pct: 38 }
  ];

  INTRO = [
    'I am Bleep. I read all 412 noticeboards so you do not have to.',
    'You pick one thing and turn up. That is the whole idea.'
  ];

  BUDDY = {
    home: ['There is a padel game tonight that is four people short. You are, technically, people.', 'Scroll a bit further. The ticker is showing off.'],
    week: ['Thursday is always the busiest. Nobody knows why. I have theories.', 'Saved things show up at the bottom. You are welcome.'],
    board: ['Omar has 1,480 XP and, I suspect, no coursework.', 'The leaderboard is meaningless. Check it anyway.'],
    social: ['Ten people, no universities, no photos. Just what they are into.', 'Connecting sends a request. Nobody gets your number by accident.'],
    post: ['Five fields. You have written longer WhatsApp messages about nothing.', 'Mention if there is food. Attendance triples. This is science.'],
    discover: ['Try the Cheese Appreciation Society. I will not explain.', 'Filters are for cowards. Press Surprise me.'],
    match: ['Answer honestly. I have no memory and no opinions. Mostly.', 'Three questions. You have filled in longer forms for free wifi.'],
    campus: ['Tap Fujairah. Nobody ever taps Fujairah.', 'Every dot is a 40-minute drive from another dot. Think bigger.'],
    careers: ['Apply to the one you feel underqualified for. That is the trick.', 'The proof list writes your CV. You just have to leave the house.'],
    wellbeing: ['Buried week? Tap Buried. I will stop bothering you until Sunday.', 'Twenty minutes of nothing is a real listing. I checked twice.'],
    dashboard: ['Level names are not motivational. They are descriptive.', 'You have XP sitting there doing nothing. Karak awaits.'],
    redeem: ['The karak one pays for itself in roughly one karak.', 'Screenshot your code. I will forget it instantly.'],
    problem: ['This is the serious page. I am being quiet.', '71% found out after it happened. I find that personally offensive.']
  };

  confettiRef = React.createRef();
  cursorRef = React.createRef();
  glowRef = React.createRef();
  BARS = (function () {
    const out = [];
    const seq = [2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 4, 2, 1, 3, 1, 2, 2, 1, 1, 3, 2, 4, 1, 2, 1, 3, 1, 2, 3, 1];
    for (let i = 0; i < seq.length; i++) out.push({ w: seq[i] + 'px' });
    return out;
  })();
  POPS = ['#ff8fab', '#7ee0d3', '#ffd166', '#9db4ff', '#c8a2ff', '#8ce99a'];
  rootRef = React.createRef();

  EMIRATES = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'];
  CATS = ['Clubs', 'Events', 'Careers', 'Startups', 'Academics', 'Creative', 'Wellbeing'];

  UNIS = [
    { name: 'American University of Sharjah', emirate: 'Sharjah' },
    { name: 'University of Sharjah', emirate: 'Sharjah' },
    { name: 'Khalifa University', emirate: 'Abu Dhabi' },
    { name: 'United Arab Emirates University', emirate: 'Abu Dhabi' },
    { name: 'Zayed University', emirate: 'Dubai' },
    { name: 'University of Wollongong in Dubai', emirate: 'Dubai' },
    { name: 'Heriot-Watt University Dubai', emirate: 'Dubai' },
    { name: 'BITS Pilani Dubai', emirate: 'Dubai' },
    { name: 'Amity University Dubai', emirate: 'Dubai' },
    { name: 'Curtin University Dubai', emirate: 'Dubai' },
    { name: 'Ajman University', emirate: 'Ajman' },
    { name: 'Umm Al Quwain University', emirate: 'Umm Al Quwain' },
    { name: 'American University of Ras Al Khaimah', emirate: 'Ras Al Khaimah' },
    { name: 'Fujairah University', emirate: 'Fujairah' }
  ];

  HERO_CATS = ['clubs', 'events', 'careers', 'startups', 'academics', 'creative', 'wellbeing'];

  JOINED_LINES = [
    'You said yes. I am recalibrating my entire model of you.',
    'Going. Actually going. I have written it down in case you deny it later.',
    'Excellent. Now the hard part, which is leaving the house.',
    'Look at us. A functional team. Do not ruin this.',
    'Bloop owes me money. He bet you would scroll past.',
    'Noted, logged, slightly emotional about it. Have a good time.'
  ];

  SNUB_LINES = [
    'Fine. Here is another one. I have four hundred, I can do this all evening.',
    'Rejected twice. My confidence is fine. Try this.',
    'Third refusal. I am not offended, I am a robot, I am definitely not offended.',
    'You are very hard to please for someone with no plans.',
    'Right. Different approach entirely. How about this.',
    'I am starting to think the problem is not the listings.'
  ];

  BOT_LINES = [
    'I read 412 noticeboards so you could keep scrolling. Anyway. This one is nine minutes away.',
    'You have nothing on. I know because you have nothing on any night. No judgement.',
    'Four people short means they will be delighted to see you. Low bar. Clear it.',
    'I picked this because it is close and nobody there is cool enough to intimidate you.',
    'Bloop wanted to suggest the Cheese Appreciation Society. I overruled him.',
    'Statistically you will not go. Statistically I will suggest it again tomorrow. We are both stubborn.',
    'This one has food. I have led with the wrong detail, clearly, so: it has food.',
    'Press the button. I have been holding this listing for eleven minutes like a maître d.'
  ];

  ITEMS = [
    { id: 1, title: 'Robotics open build night', cat: 'Clubs', uni: 'American University of Sharjah', emirate: 'Sharjah', when: 'Tue 17:30', spots: '6 of 20 spots left', blurb: 'Turn up, solder something, break it, fix it. No prior competence required or expected.', tags: ['build', 'make', 'evening'], proof: 'Hands-on electronics and rapid prototyping' },
    { id: 2, title: 'Padel, permanently four people short', cat: 'Events', uni: 'Khalifa University', emirate: 'Abu Dhabi', when: 'Wed 19:15', spots: 'Always short', blurb: 'The court is booked whether you come or not. Skill level: cheerful.', tags: ['move', 'evening'], proof: 'Nothing. You had fun. That is allowed' },
    { id: 3, title: 'Emirates Debate Open, team registration', cat: 'Events', uni: 'Zayed University', emirate: 'Dubai', when: 'Closes 14 Oct', spots: '11 teams entered', blurb: 'Argue about things for a trophy. Cross-uni teams welcome and mildly encouraged.', tags: ['talk', 'weekend'], proof: 'Public speaking under pressure, with a result to point at' },
    { id: 4, title: '48-hour campus hackathon', cat: 'Startups', uni: 'BITS Pilani Dubai', emirate: 'Dubai', when: 'Closes 22 Oct', spots: 'Teams of 4', blurb: 'Build something in a weekend. Sleep is technically permitted but socially discouraged.', tags: ['build', 'weekend', 'money'], proof: 'A shipped prototype and a team you can actually name' },
    { id: 5, title: 'Founders table. 12 seats, no pitch decks', cat: 'Startups', uni: 'University of Wollongong in Dubai', emirate: 'Dubai', when: 'Thu 18:00', spots: '3 seats left', blurb: 'Twelve people with half-finished ideas and one very long table.', tags: ['talk', 'build', 'evening', 'money'], proof: 'A founder network and a sharper one-line pitch' },
    { id: 6, title: 'Quiet study room. No talking. Ever.', cat: 'Academics', uni: 'Zayed University', emirate: 'Abu Dhabi', when: 'Daily 20:00', spots: 'Usually free', blurb: 'The library, but enforced. Bring only what you intend to finish.', tags: ['quiet', 'hour'], proof: 'A finished assignment, which is the entire point' },
    { id: 7, title: 'Calculus rescue group', cat: 'Academics', uni: 'United Arab Emirates University', emirate: 'Abu Dhabi', when: 'Sun 16:00', spots: '8 regulars', blurb: 'Peer-led, exam-shaped, run by people who also failed it once.', tags: ['quiet', 'hour'], proof: 'Peer tutoring experience and a better grade' },
    { id: 8, title: 'Film club: bad films, taken far too seriously', cat: 'Creative', uni: 'American University of Sharjah', emirate: 'Sharjah', when: 'Mon 20:00', spots: 'Open room', blurb: 'We watch something indefensible, then defend it for an hour.', tags: ['talk', 'make', 'evening'], proof: 'Critical analysis and running a weekly programme' },
    { id: 9, title: 'Ceramics studio, open hours', cat: 'Creative', uni: 'Ajman University', emirate: 'Ajman', when: 'Sat 11:00', spots: '4 wheels free', blurb: 'Make something wonky on purpose. Clay does not judge you or your GPA.', tags: ['make', 'quiet', 'hour'], proof: 'A physical thing you made with your hands' },
    { id: 10, title: 'Summer internship, logistics analytics', cat: 'Careers', uni: 'Higher Colleges of Technology', emirate: 'Abu Dhabi', when: '30 Nov', spots: '2 places', blurb: 'Ten weeks, paid, real dataset, real deadlines, alarmingly good coffee machine.', tags: ['build', 'money', 'weekend'], proof: 'Applied data analysis on a real operational dataset' },
    { id: 11, title: 'Design internship, brand systems', cat: 'Careers', uni: 'American University in the Emirates', emirate: 'Dubai', when: '12 Nov', spots: '1 place', blurb: 'Small studio, terrifying volume of feedback, excellent portfolio at the end.', tags: ['make', 'money'], proof: 'A shipped brand system and a portfolio piece' },
    { id: 12, title: 'Research assistant, coastal ecology', cat: 'Careers', uni: 'University of Sharjah', emirate: 'Sharjah', when: '5 Dec', spots: '3 places', blurb: 'Fieldwork at 6am. Bring shoes you are not emotionally attached to.', tags: ['quiet', 'weekend', 'money'], proof: 'Field data collection and a named credit on a paper' },
    { id: 13, title: 'Mentor circle: first job, honest version', cat: 'Careers', uni: 'Heriot-Watt University Dubai', emirate: 'Dubai', when: 'Wed 17:00', spots: '10 pairs', blurb: 'Graduates two years ahead of you explaining exactly what they got wrong.', tags: ['talk', 'hour'], proof: 'A mentor and a realistic plan' },
    { id: 14, title: 'Morning run club. 5km, zero heroics', cat: 'Wellbeing', uni: 'American University of Ras Al Khaimah', emirate: 'Ras Al Khaimah', when: 'Sat 06:30', spots: 'Open', blurb: 'Slow pace, guaranteed. Walking is a valid running strategy here.', tags: ['move', 'hour'], proof: 'Consistency, which is harder than it sounds' },
    { id: 15, title: 'Twenty minutes of nothing', cat: 'Wellbeing', uni: 'University of Sharjah', emirate: 'Sharjah', when: 'Daily 13:00', spots: 'Drop in', blurb: 'A room, a cushion, no phone, no talking, no goals. Then you leave.', tags: ['quiet', 'hour'], proof: 'A stress habit that actually works' },
    { id: 16, title: 'Counselling drop-in, no appointment', cat: 'Wellbeing', uni: 'Every campus', emirate: 'Dubai', when: 'Mon–Thu', spots: 'Always available', blurb: 'Free, confidential, and you do not need a reason or a crisis to go.', tags: ['quiet', 'hour'], proof: 'Looking after yourself. Not a CV line' },
    { id: 17, title: 'Cooking for people who own one pan', cat: 'Wellbeing', uni: 'Ajman University', emirate: 'Ajman', when: 'Fri 18:00', spots: '12 places', blurb: 'Four meals, one pan, under 20 dirhams each. Yes, really. No, not noodles.', tags: ['make', 'hour'], proof: 'You stop eating instant noodles' },
    { id: 18, title: 'Marine conservation beach survey', cat: 'Clubs', uni: 'Fujairah University', emirate: 'Fujairah', when: 'Sat 07:00', spots: '15 places', blurb: 'Count things, log things, swim afterwards. Sunscreen is not optional.', tags: ['move', 'quiet', 'weekend'], proof: 'Environmental fieldwork and volunteer hours' },
    { id: 19, title: 'Arabic calligraphy, absolute beginners', cat: 'Creative', uni: 'Umm Al Quwain University', emirate: 'Umm Al Quwain', when: 'Sun 17:00', spots: '9 places', blurb: 'One letter a week. Your first attempts will be terrible. So were everyone\u2019s.', tags: ['make', 'quiet', 'hour'], proof: 'A craft skill and steadier hands' },
    { id: 20, title: 'Model UN, regional round', cat: 'Events', uni: 'American University of Ras Al Khaimah', emirate: 'Ras Al Khaimah', when: 'Closes 8 Nov', spots: '40 delegates', blurb: 'Wear the blazer. Represent a country. Take it far too seriously. Thrive.', tags: ['talk', 'weekend'], proof: 'Negotiation and formal public speaking' },
    { id: 21, title: 'Basketball, mixed, genuinely mixed', cat: 'Events', uni: 'Ajman University', emirate: 'Ajman', when: 'Tue 20:00', spots: 'Open run', blurb: 'All levels. Someone will be worse than you. It is often us.', tags: ['move', 'evening'], proof: 'Team sport, and cardio you did not dread' },
    { id: 22, title: 'Startup grant clinic. AED 50k track', cat: 'Startups', uni: 'Khalifa University', emirate: 'Abu Dhabi', when: 'Closes 1 Dec', spots: 'Rolling', blurb: 'Bring an idea and a spreadsheet. They will gently fix the spreadsheet.', tags: ['build', 'money', 'talk'], proof: 'A funded proposal and grant-writing experience' },
    { id: 23, title: 'Photography walk, old Dubai', cat: 'Creative', uni: 'Amity University Dubai', emirate: 'Dubai', when: 'Fri 16:30', spots: '14 places', blurb: 'Three hours, one lens, no tripods. Phone cameras absolutely count.', tags: ['make', 'move', 'hour'], proof: 'A shot portfolio and real composition practice' },
    { id: 24, title: 'Peer note-swap, engineering years 1–2', cat: 'Academics', uni: 'Fujairah University', emirate: 'Fujairah', when: 'Ongoing', spots: '60 members', blurb: 'Everyone uploads. Everyone downloads. Nobody speaks. Beautiful.', tags: ['quiet', 'hour'], proof: 'Collaborative learning and organised notes' },
    { id: 25, title: 'Cheese Appreciation Society', cat: 'Clubs', uni: 'Heriot-Watt University Dubai', emirate: 'Dubai', when: 'Thu 19:00', spots: '5 wedges left', blurb: 'Nine members, one fridge, endless discourse. Halloumi week is competitive.', tags: ['talk', 'make', 'evening'], proof: 'Event budgeting for a club with unusual costs' },
    { id: 26, title: 'Competitive Spreadsheet Club', cat: 'Clubs', uni: 'University of Wollongong in Dubai', emirate: 'Dubai', when: 'Mon 18:00', spots: '12 seats', blurb: 'Timed Excel challenges with a leaderboard. Somehow it is thrilling. Recruiters love it.', tags: ['build', 'quiet', 'evening'], proof: 'Advanced spreadsheet modelling, demonstrably' },
    { id: 27, title: 'Desert Astronomy Club, telescope night', cat: 'Clubs', uni: 'United Arab Emirates University', emirate: 'Abu Dhabi', when: 'Fri 21:30', spots: '18 places', blurb: 'We drive 40 minutes away from streetlights and look up. Bring a jumper.', tags: ['quiet', 'move', 'evening'], proof: 'Observational astronomy and trip logistics' },
    { id: 28, title: 'Anime & Manga Club (arguing division)', cat: 'Clubs', uni: 'Amity University Dubai', emirate: 'Dubai', when: 'Wed 17:30', spots: 'Open', blurb: 'Watch one episode, argue for ninety minutes. Subs vs dubs is a banned topic.', tags: ['talk', 'evening'], proof: 'Running a community and moderating a fierce debate' },
    { id: 29, title: 'Bake Sale Cartel', cat: 'Clubs', uni: 'Ajman University', emirate: 'Ajman', when: 'Sun 12:00', spots: '8 bakers', blurb: 'We fundraise with brownies and undisclosed profit margins. Nobody has audited us.', tags: ['make', 'money', 'hour'], proof: 'Small-scale fundraising and pricing strategy' },
    { id: 30, title: 'Falcon & Wildlife Photography Club', cat: 'Clubs', uni: 'American University of Ras Al Khaimah', emirate: 'Ras Al Khaimah', when: 'Sat 06:00', spots: '10 places', blurb: 'Very early, very worth it. The birds do not wait for you to wake up.', tags: ['make', 'move', 'weekend'], proof: 'Wildlife photography and absurd patience' },
    { id: 31, title: 'Board Game Society, no Monopoly, ever', cat: 'Clubs', uni: 'University of Sharjah', emirate: 'Sharjah', when: 'Tue 18:30', spots: 'Open tables', blurb: 'Rule explained in 4 minutes, game plays for 3 hours, friendships survive narrowly.', tags: ['talk', 'quiet', 'evening'], proof: 'Strategic thinking and remarkable conflict resolution' },
    { id: 32, title: 'Language Swap: Arabic ↔ everything', cat: 'Clubs', uni: 'Zayed University', emirate: 'Dubai', when: 'Thu 16:00', spots: '20 pairs', blurb: 'You teach yours, they teach theirs. Mistakes are the actual curriculum.', tags: ['talk', 'hour'], proof: 'Conversational language skills and cross-cultural teaching' },
    { id: 33, title: 'Beach Cleanup Crew (with kayaks)', cat: 'Clubs', uni: 'Fujairah University', emirate: 'Fujairah', when: 'Sat 08:00', spots: '22 places', blurb: 'Half volunteering, half kayaking. We are honest about the ratio: it is 50/50.', tags: ['move', 'weekend'], proof: 'Volunteer hours and event coordination' },
    { id: 34, title: 'Retro Console Repair Club', cat: 'Clubs', uni: 'BITS Pilani Dubai', emirate: 'Dubai', when: 'Wed 19:00', spots: '9 benches', blurb: 'We fix consoles older than us. Success rate: 60%. Emotional investment: 100%.', tags: ['build', 'make', 'evening'], proof: 'Hardware diagnostics and soldering' },
    { id: 35, title: 'Poetry &amp; Open Mic Night', cat: 'Creative', uni: 'Umm Al Quwain University', emirate: 'Umm Al Quwain', when: 'Mon 19:30', spots: '14 slots', blurb: 'Three-minute limit, kind audience, no snapping. You can also just watch.', tags: ['talk', 'make', 'evening'], proof: 'Performance confidence and a body of written work' },
    { id: 36, title: 'Sunrise Hike Club. Jebel Jais', cat: 'Wellbeing', uni: 'American University of Ras Al Khaimah', emirate: 'Ras Al Khaimah', when: 'Sat 05:00', spots: '16 places', blurb: 'Brutal alarm, unreasonable views, one shared flask. Transport included.', tags: ['move', 'weekend'], proof: 'Endurance and trip planning' }
  ];

  QUESTS = [
    { id: 'q1', label: 'Go to one thing at a university that is not yours', xp: 80, note: 'The entire point of Loop, honestly' },
    { id: 'q2', label: 'Say one full sentence to a stranger at an event', xp: 50, note: '"Is this the right room?" counts' },
    { id: 'q3', label: 'Apply to one thing you feel underqualified for', xp: 70, note: 'Everyone else also felt underqualified' },
    { id: 'q4', label: 'Drag along someone who never goes to anything', xp: 60, note: 'You already know exactly who' },
    { id: 'q5', label: 'Do one thing that is not for your CV', xp: 40, note: 'Ceramics. We keep recommending ceramics' }
  ];

  REWARDS = [
    { id: 'r1', kind: 'Food', title: 'Free karak with any sandwich', cost: 150, brand: 'Campus cafeteria network', terms: 'One per week', blurb: 'The default currency of UAE student life, now free-er.', code: 'LOOP-KRK-4417' },
    { id: 'r2', kind: 'Food', title: 'AED 20 off a shawarma run', cost: 250, brand: 'Partner outlets near campus', terms: 'Min spend AED 40', blurb: 'Enough for you, or for you and someone you are trying to impress.', code: 'LOOP-SHW-9082' },
    { id: 'r3', kind: 'Transport', title: '5 discounted metro trips', cost: 400, brand: 'Student travel partner', terms: 'Valid 30 days', blurb: 'Because the cross-uni thing only works if you can get there.', code: 'LOOP-MTR-2231' },
    { id: 'r4', kind: 'Study', title: '2 hours of a private study pod', cost: 500, brand: 'Co-study spaces', terms: 'Book 24h ahead', blurb: 'A door that closes. During exam season this is priceless.', code: 'LOOP-POD-7710' },
    { id: 'r5', kind: 'Fitness', title: 'One-month gym or padel pass', cost: 900, brand: 'Campus sports partners', terms: 'New members only', blurb: 'A month is exactly long enough to develop a personality about it.', code: 'LOOP-FIT-5563' },
    { id: 'r6', kind: 'Tech', title: '15% off design & dev software', cost: 700, brand: 'Student software bundle', terms: 'Annual plans', blurb: 'For the portfolio you keep saying you will start on Sunday.', code: 'LOOP-SFT-3348' },
    { id: 'r7', kind: 'Events', title: 'Free entry to any ticketed campus event', cost: 600, brand: 'Loop partner clubs', terms: 'Subject to capacity', blurb: 'Includes the ones with a suspiciously expensive ticket price.', code: 'LOOP-EVT-1129' },
    { id: 'r8', kind: 'Books', title: 'AED 50 off print & stationery', cost: 350, brand: 'Campus print shops', terms: 'One per semester', blurb: 'For the thesis you will print at 3am, twice, because of one typo.', code: 'LOOP-PRN-8804' }
  ];

  MOODS = [
    { key: 'good', label: 'Good', title: 'Suspicious. Noted.', msg: 'While the momentum lasts, spend it on the thing you keep putting off. Loop will push the bigger stuff up your feed this week.', sug: 'the 48-hour hackathon' },
    { key: 'fine', label: 'Fine', title: 'Fine is a perfectly good week.', msg: 'One low-commitment thing, an hour long, near you. Nothing that needs a team, a blazer or a slide deck.', sug: 'the film club' },
    { key: 'busy', label: 'Buried', title: 'Understood. Nothing social this week.', msg: 'We will only show you quiet rooms and study groups until Sunday. No events, no nudges, no streak guilt.', sug: 'the quiet study room' },
    { key: 'flat', label: 'Flat', title: 'Then let us aim spectacularly low.', msg: 'Twenty minutes of nothing, or a slow 5km where walking is officially allowed. That is the entire ask.', sug: 'twenty minutes of nothing' },
    { key: 'rough', label: 'Rough', title: 'Thanks for saying so.', msg: 'The counselling drop-in needs no appointment and no reason. Your streak is paused, it will still be here when you get back.', sug: 'the counselling drop-in' }
  ];

  Q1 = [
    { key: 'build', label: 'Building things that beep or compile' },
    { key: 'talk', label: 'Talking to humans, arguing optional' },
    { key: 'move', label: 'Moving my body around a court' },
    { key: 'make', label: 'Making something with my hands' }
  ];
  Q2 = [
    { key: 'hour', label: 'One hour a week. Firmly one.' },
    { key: 'evening', label: 'One evening a week' },
    { key: 'weekend', label: 'A whole weekend, occasionally' }
  ];
  Q3 = [
    { key: 'money', label: 'Money, or something CV-shaped' },
    { key: 'talk', label: 'Actual friends' },
    { key: 'quiet', label: 'To finish my degree, quietly' },
    { key: 'make', label: 'No idea. Surprise me.' }
  ];


  navTo(r, extra) {
    clearTimeout(this.turnTimer);
    this.setState(Object.assign({ route: r, turning: true }, extra || {}));
    window.scrollTo(0, 0);
    this.turnTimer = setTimeout(() => this.setState({ turning: false }), 460);
  }

  applyPalette() {
    const el = this.rootRef.current;
    const p = this.PALETTES.filter((x) => x.key === this.state.palette)[0] || this.PALETTES[0];
    if (!el) return;
    // every palette's c[] runs strongest-ink-first RELATIVE TO ITS OWN GROUND, so the
    // ramp maps straight through; any reordering breaks 100 < 200 < ... monotonicity
    ['100', '200', '300', '400', '500', '600'].forEach((step, i) => {
      el.style.setProperty('--color-accent-' + step, p.c[i]);
      el.style.setProperty('--color-accent-2-' + step, p.c[i]);
      document.documentElement.style.setProperty('--color-accent-' + step, p.c[i]);
    });
    el.style.setProperty('--color-on-accent', p.onAccent || (p.light ? '#ffffff' : p.bg));
    el.style.setProperty('--color-accent', p.c[3]);
    el.style.setProperty('--color-section', p.section);
    el.style.setProperty('--color-section-glow', p.glow);
    el.style.setProperty('--color-bg', p.bg);
    document.documentElement.style.setProperty('--color-bg', p.bg);
    el.style.setProperty('--color-surface', p.surface);
    el.style.setProperty('--color-neutral-900', p.ink || p.bg);
    el.style.setProperty('--color-neutral-800', p.light ? p.ink : p.surface);
    el.style.setProperty('--pencil', p.light || p.key === 'newsprint' || p.key === 'sandstorm' ? '#a33d28' : '#ff9b7d');
    if (p.text) {
      el.style.setProperty('--color-text', p.text);
      document.documentElement.style.setProperty('--color-text', p.text);
      document.body.style.color = p.text;
    }
    document.body.style.background = p.bg;
    document.documentElement.style.background = p.bg;
    this.palColors = [p.c[2], p.c[3], p.c[4], p.c[1], p.glow];
  }

  componentDidMount() {
    this.lastProp = this.props.palette;
    if (this.props.palette && this.props.palette !== this.state.palette) this.setState({ palette: this.props.palette });
    this.loadSession();
    this.applyPalette();
    this.observeReveals();

    const targets = [218241, 103, 412];
    const start = performance.now();
    const step = () => {
      const t = Math.min((performance.now() - start) / 1100, 1);
      const e = 1 - Math.pow(1 - t, 3);
      this.setState({ c1: Math.round(targets[0] * e), c2: Math.round(targets[1] * e), c3: Math.round(targets[2] * e) });
      if (t < 1) this.countRaf = requestAnimationFrame(step);
    };
    this.countRaf = requestAnimationFrame(step);

    this.botTimer = setInterval(() => {
      this.setState((st) => ({ botIdx: (st.botIdx + 1) % this.BOT_LINES.length }));
    }, 7000);

    this.liveTimer = setInterval(() => {
      const p = this.PEERS[Math.floor(Math.random() * this.PEERS.length)];
      const gain = 5 + Math.floor(Math.random() * 26);
      const verb = this.LIVE_VERBS[Math.floor(Math.random() * this.LIVE_VERBS.length)];
      this.setState((st) => {
        const bonus = Object.assign({}, st.boardBonus);
        const delta = Object.assign({}, st.boardDelta);
        bonus[p.name] = (bonus[p.name] || 0) + gain;
        delta[p.name] = gain;
        return { boardBonus: bonus, boardDelta: delta, liveFeed: p.name.split(' ')[0] + ' ' + verb + ', +' + gain + ' XP' };
      });
      clearTimeout(this.deltaTimer);
    clearTimeout(this.peelTimer);
      this.deltaTimer = setTimeout(() => this.setState({ boardDelta: {} }), 2600);
    }, 5200);

    this.popI = 0;
    this.gx = 0; this.gy = 0; this.tx = 0; this.ty = 0;
    const rootEl = this.rootRef.current;
    if (rootEl) rootEl.style.setProperty('--pop', this.POPS[0]);
    this.onMove = (ev) => {
      const el = this.cursorRef.current;
      this.tx = ev.clientX; this.ty = ev.clientY;
      if (!el || this.props.cursorGlow === false) return;
      el.style.transform = 'translate(' + ev.clientX + 'px,' + ev.clientY + 'px)';
      el.style.opacity = '1';
      const hot = ev.target && ev.target.closest && ev.target.closest('button, a, label, input, select');
      el.style.width = hot ? '40px' : '26px';
      el.style.height = hot ? '40px' : '26px';
      el.style.margin = hot ? '-20px 0 0 -20px' : '-13px 0 0 -13px';
      const g = this.glowRef.current;
      if (g && !this.state.calm) g.style.opacity = '1';
    };
    this.onLeave = () => {
      const el = this.cursorRef.current; if (el) el.style.opacity = '0';
      const g = this.glowRef.current; if (g) g.style.opacity = '0';
    };
    window.addEventListener('mousemove', this.onMove);
    window.addEventListener('mouseout', this.onLeave);

    this.popTimer = setInterval(() => {
      this.popI = (this.popI + 1) % this.POPS.length;
      const r = this.rootRef.current;
      if (r && !this.state.calm) r.style.setProperty('--pop', this.POPS[this.popI]);
    }, 2600);

    const follow = () => {
      this.gx += (this.tx - this.gx) * 0.085;
      this.gy += (this.ty - this.gy) * 0.085;
      const g = this.glowRef.current;
      if (g) g.style.transform = 'translate(' + this.gx + 'px,' + this.gy + 'px)';
      this.raf = requestAnimationFrame(follow);
    };
    this.raf = requestAnimationFrame(follow);
  }

  componentDidUpdate() {
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.saveSession(), 400);

    const wasRoute = this.lastRoute;
    this.lastRoute = this.state.route;
    if (this.state.route === 'discover' && wasRoute !== 'discover') this.scramble();
    if (this.props.palette && this.props.palette !== this.lastProp) {
      this.lastProp = this.props.palette;
      if (this.props.palette !== this.state.palette) { this.setState({ palette: this.props.palette }); return; }
    }
    this.applyPalette();

    if (this.state.route === 'problem' && !this.state.psAnim) {
      clearTimeout(this.psTimer);
      this.psTimer = setTimeout(() => { this.setState({ psAnim: true }); this.observeReveals(); this.runPsCounters(); }, 140);
    } else if (this.state.route !== 'problem' && this.state.psAnim) {
      clearTimeout(this.psTimer);
      clearInterval(this.psCount);
      this.setState({ psAnim: false, psN: this.PS_TARGETS });
    }
  }

  PS_TARGETS = [218241, 103, 35];   // MoHE 218,241 / 103 · KHDA 35%, cited beside each figure

  // the three published figures are rendered static from PS_TARGETS. They were
  // previously counted up, but a stalled frame loop published "0" as the evidence
  // base of the assessed page, so correctness wins over the flourish here.
  scramble() {
    if (this.scramRunning) return;
    if (this.state.calm) { this.setState({ scram: 'DISCOVER' }); return; }
    const target = 'DISCOVER';
    const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    this.scramRunning = true;
    cancelAnimationFrame(this.scramRaf);
    const start = performance.now();
    const step = () => {
      const settled = Math.floor((performance.now() - start) / 62);
      if (settled >= target.length) {
        this.scramRunning = false;
        this.setState({ scram: target });
        return;
      }
      let out = target.slice(0, settled);
      for (let k = settled; k < target.length; k++) out += pool[Math.floor(Math.random() * pool.length)];
      this.setState({ scram: out });
      this.scramRaf = requestAnimationFrame(step);
    };
    this.scramRaf = requestAnimationFrame(step);
    // if frames never arrive, publish the word anyway
    clearTimeout(this.scramFallback);
    this.scramFallback = setTimeout(() => {
      cancelAnimationFrame(this.scramRaf);
      this.scramRunning = false;
      if (this.state.scram !== target) this.setState({ scram: target });
    }, 1400);
  }

  runPsCounters() {
    if (this.state.psN[1] !== this.PS_TARGETS[1]) this.setState({ psN: this.PS_TARGETS });
  }

  observeReveals() {
    const root = this.rootRef.current;
    if (!root) return;
    const show = (el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.querySelectorAll('[data-bar]').forEach((bar) => { bar.style.width = bar.getAttribute('data-w') || '0%'; });
    };
    const hide = (el) => {
      if (el.dataset.rvShown === '1') return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
    };

    if (!this.revealSweep) {
      this.revealSweep = () => {
        const r = this.rootRef.current;
        if (!r) return;
        r.querySelectorAll('[data-reveal]').forEach((el) => {
          if (el.dataset.rvShown === '1') return;
          if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
            el.dataset.rvShown = '1';
            show(el);
          }
        });
      };
      window.addEventListener('scroll', this.revealSweep, { passive: true });
      window.addEventListener('resize', this.revealSweep, { passive: true });
    }

    // markup ships visible; we only hide what is still below the fold, so a failed
    // re-render or a jump-scroll can never leave content permanently invisible
    const pass = () => {
      const r = this.rootRef.current;
      if (!r) return;
      r.querySelectorAll('[data-reveal]').forEach((el) => {
        if (el.getBoundingClientRect().top > window.innerHeight * 0.9) hide(el);
        else { el.dataset.rvShown = '1'; show(el); }
      });
    };
    pass();
    // the counter animation re-renders for about a second and resets inline styles
    [250, 600, 1100].forEach((ms) => setTimeout(pass, ms));
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.countRaf);
    clearInterval(this.botTimer);
    cancelAnimationFrame(this.scramRaf);
    clearTimeout(this.scramFallback);
    clearTimeout(this.pokeTimer);
    clearTimeout(this.toastTimer);
    window.removeEventListener('mousemove', this.onMove);
    window.removeEventListener('mouseout', this.onLeave);
    clearInterval(this.liveTimer);
    clearInterval(this.popTimer);
    cancelAnimationFrame(this.raf);
    clearTimeout(this.deltaTimer);
    clearTimeout(this.peelTimer);
    clearTimeout(this.dmTimer);
    clearTimeout(this.dmReplyTimer);
    clearTimeout(this.tearTimer);
    clearInterval(this.musicTimer);
    clearTimeout(this.turnTimer);
    clearTimeout(this.saveTimer);
    this.saveSession();
    try { if (this.actx) this.actx.close(); } catch (e) {}
    if (this.io) this.io.disconnect();
    if (this.revealSweep) {
      window.removeEventListener('scroll', this.revealSweep);
      window.removeEventListener('resize', this.revealSweep);
    }
  }

  say(msg) {
    this.setState({ toast: msg });
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.setState({ toast: '' }), 2800);
  }

  burst() {
    if (this.props.confetti === false) return;
    const host = this.confettiRef.current;
    if (!host) return;
    const cols = this.palColors || ['#d2cefd', '#b5abfc', '#968ae0', '#e7e5fe', '#4c5397'];
    for (let i = 0; i < 30; i++) {
      const s = document.createElement('span');
      s.style.cssText = 'position:absolute;top:6%;left:' + (32 + Math.random() * 36) + '%;width:8px;height:13px;border-radius:2px;background:' + cols[i % 5] + ';--dx:' + Math.round((Math.random() * 2 - 1) * 300) + 'px;transform:rotate(' + Math.round(Math.random() * 360) + 'deg);animation:y-fall ' + Math.round(1200 + Math.random() * 900) + 'ms cubic-bezier(.2,.6,.35,1) forwards;';
      host.appendChild(s);
      setTimeout(() => s.remove(), 2300);
    }
  }

  askToJoin(it) {
    return () => {
      if (this.state.joined[it.id]) {
        const joined = Object.assign({}, this.state.joined);
        delete joined[it.id];
        this.setState({ joined: joined, xp: Math.max(0, this.state.xp - 25) });
        this.say('Left it. We all have weeks like this.');
        return;
      }
      this.setState({ pending: it, sidInput: this.state.lastSid, sidError: false });
    };
  }

  submitId = () => {
    const sid = this.state.sidInput.trim();
    if (sid.length < 5) { this.setState({ sidError: true }); return; }
    const it = this.state.pending;
    const friend = this.state.friendInput.trim();
    const gain = friend ? 35 : 25;
    const joined = Object.assign({}, this.state.joined);
    if (it) joined[it.id] = true;
    const shuffled = this.PEOPLE.slice().sort(() => Math.random() - 0.5).slice(0, 4).map((p) => p.id);
    const peeling = Object.assign({}, this.state.peeling);
    if (it) peeling[it.id] = true;
    this.setState({ joined: joined, heroMood: 'joined', xp: this.state.xp + gain, pending: null, sidError: false, lastSid: sid, lastFriend: friend, friendInput: '', lastXp: gain, showSuccess: true, attendees: shuffled, peeling: peeling });
    if (it) {
      clearTimeout(this.peelTimer);
      this.peelTimer = setTimeout(() => {
        const gone = Object.assign({}, this.state.gone);
        const p = Object.assign({}, this.state.peeling);
        gone[it.id] = true;
        delete p[it.id];
        this.setState({ gone: gone, peeling: p });
      }, 820);
    }
    this.burst();
  };

  holdStart() {
    if (this.holdTimer) return;
    this.setState({ holding: true });
    this.holdTimer = setInterval(() => {
      this.setState((st) => {
        const pct = st.gatePct + 4;
        if (pct >= 100) {
          clearInterval(this.holdTimer);
          this.holdTimer = null;
          if (st.introStep < this.INTRO.length - 1) {
            // jump two lines per hold: three lines of Bleep, two holds, not three
            const next = Math.min(this.INTRO.length - 1, st.introStep + 2);
            setTimeout(() => this.setState({ introStep: next, gatePct: 0, holding: false }), 260);
            return { gatePct: 100 };
          }
          setTimeout(() => { this.setState({ intro: false }); this.burst(); }, 320);
          return { gatePct: 100, holding: false };
        }
        return { gatePct: pct };
      });
    }, 26);
  }

  holdEnd() {
    if (!this.holdTimer) return;
    clearInterval(this.holdTimer);
    this.holdTimer = null;
    this.setState({ holding: false });
    this.drain = setInterval(() => {
      this.setState((st) => {
        if (st.gatePct <= 0 || this.holdTimer) { clearInterval(this.drain); return { gatePct: this.holdTimer ? st.gatePct : 0 }; }
        return { gatePct: Math.max(0, st.gatePct - 7) };
      });
    }, 22);
  }

  items() { return this.ITEMS.concat(this.state.posted); }

  ask(qRaw) {
    const q = (qRaw || '').trim();
    if (!q) return;
    const base = this.state.chat.length ? this.state.chat : [];
    this.setState({ chat: base.concat([{ who: 'me', text: q }, { who: 'bloop', text: '…' }]), chatInput: '' });
    clearTimeout(this.askTimer);
    this.askTimer = setTimeout(() => {
      this.setState((st) => {
        const c = st.chat.slice();
        c[c.length - 1] = { who: 'bloop', text: this.answerFor(q) };
        return { chat: c };
      });
    }, 420);
  }

  pickMood(key) {
    if (!key) { this.setState({ mood: null }); return; }
    const said = {
      good: 'Look at you. I am matching your energy and it is exhausting.',
      fine: 'Fine. My favourite answer. Nothing is on fire.',
      busy: 'Squinting in solidarity. Nothing social until Sunday.',
      flat: 'Same. We will aim very low together.',
      rough: 'I have stopped bobbing. Take your time.'
    }[key];
    this.setState({ mood: key, buddyOpen: true, chat: [{ who: 'bloop', text: said }] });
  }

  dropCuties(kind) {
    if (this.state.calm) return;
    const set = kind === 'rough'
      ? ['🐱', '🌸', '🐈', '🌼', '🐾', '🌻', '🐈‍⬛', '💐']
      : ['🌸', '🌼', '🌷', '🌻', '💮', '🌺', '🐱', '🍡'];
    const cuties = [];
    for (let i = 0; i < 26; i++) {
      cuties.push({
        glyph: set[Math.floor(Math.random() * set.length)],
        left: (Math.random() * 96).toFixed(1) + 'vw',
        size: (20 + Math.random() * 22).toFixed(0) + 'px',
        dx: (Math.random() * 120 - 60).toFixed(0) + 'px',
        rot: (Math.random() * 720 - 360).toFixed(0) + 'deg',
        dur: (3.4 + Math.random() * 2.2).toFixed(2) + 's',
        delay: (Math.random() * 1.4).toFixed(2) + 's'
      });
    }
    this.setState({ cuties: cuties });
    clearTimeout(this.cutieTimer);
    this.cutieTimer = setTimeout(() => this.setState({ cuties: [] }), 7000);
  }

  person(p) {
    const on = !!this.state.connected[p.id];
    return {
      id: p.id, name: p.name, year: p.year, tags: p.tags, line: p.line, looking: p.looking,
      initials: p.name.split(' ').map((w) => w[0]).join(''),
      btnLabel: on ? 'Request sent' : 'Connect',
      btnBg: on ? 'var(--color-accent-300)' : 'transparent',
      btnFg: on ? 'var(--color-on-accent)' : 'var(--color-accent-200)',
      onConnect: () => {
        if (this.state.connected[p.id]) return;
        const c = Object.assign({}, this.state.connected);
        c[p.id] = true;
        this.setState({ connected: c, xp: this.state.xp + 15 });
        this.say('Request sent to ' + p.name + '. +15 XP for being the one who reached out.');
        clearTimeout(this.dmTimer);
        this.dmTimer = setTimeout(() => this.pushDm(p), 1600);
      }
    };
  }

  submitSignup = () => {
    const s = this.state;
    if (s.suNameIn.trim().length < 2 || s.suMailIn.trim().indexOf('@') < 0) { this.setState({ suError: true }); return; }
    this.setState({
      signedUp: true, suName: s.suNameIn.trim(), suUni: s.suUniIn,
      uni: s.suUniIn, xp: s.xp + 100, suError: false
    });
    this.burst();
    this.say('Account created. +100 XP joining bonus.');
  };

  daysFor(it) {
    const w = it.when || '';
    if (/^Daily/.test(w) || /^Ongoing/i.test(w)) return this.DAYS.slice();
    if (/Mon–Thu/.test(w)) return ['Mon', 'Tue', 'Wed', 'Thu'];
    return this.DAYS.filter((d) => w.indexOf(d) === 0);
  }

  timeFor(it) {
    const m = (it.when || '').match(/\d{1,2}:\d{2}/);
    return m ? m[0] : 'all day';
  }

  toggleSave(it) {
    return () => {
      const saved = Object.assign({}, this.state.saved);
      if (saved[it.id]) { delete saved[it.id]; this.setState({ saved: saved }); this.say('Unsaved. Ruthless.'); }
      else { saved[it.id] = true; this.setState({ saved: saved }); this.say('Saved. It lives on This week now.'); }
    };
  }

  submitPost = () => {
    const s = this.state;
    if (s.pTitle.trim().length < 3 || s.pWhen.trim().length < 2) { this.setState({ pError: true }); return; }
    const uni = this.UNIS.filter((u) => u.name === s.pUni)[0] || this.UNIS[0];
    const item = {
      id: 1000 + s.posted.length, mine: true,
      title: s.pTitle.trim(), cat: s.pCat, uni: uni.name, emirate: uni.emirate,
      when: s.pWhen.trim(), spots: 'Just posted',
      blurb: s.pBlurb.trim() || 'No description. Bold, mysterious, probably fine.',
      tags: ['make', 'talk'], proof: 'Organised and ran your own listing'
    };
    this.setState({ posted: s.posted.concat([item]), xp: s.xp + 100, pTitle: '', pWhen: '', pBlurb: '', pError: false });
    this.burst();
    this.say('Live in the feed. +100 XP.');
  };

  toggleQuest(q) {
    return () => {
      const done = Object.assign({}, this.state.done);
      if (done[q.id]) {
        delete done[q.id];
        this.setState({ done: done, xp: Math.max(0, this.state.xp - q.xp) });
        this.say('Unticked. Bold move.');
      } else {
        done[q.id] = true;
        this.setState({ done: done, xp: this.state.xp + q.xp });
        this.burst();
        this.say('+' + q.xp + ' XP. Genuinely well done.');
      }
    };
  }

  // filtered noise burst: a paper tear is broadband, not tonal
  tearSound() {
    if (this.state.calm) return;
    try {
      const ctx = this.audioCtx();
      if (!ctx) return;
      const dur = 0.42;
      const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const p = i / data.length;
        // uneven crackle: the rip is a series of small catches, not a smooth hiss
        const grain = Math.random() < 0.35 ? 1 : 0.32;
        data[i] = (Math.random() * 2 - 1) * grain * Math.pow(1 - p, 1.7);
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(2600, ctx.currentTime);
      bp.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + dur);
      bp.Q.value = 0.8;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.16, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      src.connect(bp).connect(g).connect(ctx.destination);
      src.start();
    } catch (e) { /* audio blocked: the animation still plays */ }
  }

  redeem(r) {
    return () => {
      if (this.state.xp < r.cost || this.state.redeemed[r.id]) return;
      const redeemed = Object.assign({}, this.state.redeemed);
      redeemed[r.id] = true;
      const tearing = Object.assign({}, this.state.tearing);
      tearing[r.id] = true;
      this.setState({ redeemed: redeemed, xp: this.state.xp - r.cost, tearing: tearing });
      this.tearSound();
      clearTimeout(this.tearTimer);
      this.tearTimer = setTimeout(() => {
        const t = Object.assign({}, this.state.tearing);
        delete t[r.id];
        this.setState({ tearing: t });
      }, 760);
      this.burst();
      this.say('Redeemed. Code is on the card, screenshot it.');
    };
  }

  matchFor() {
    const want = [this.state.m1, this.state.m2, this.state.m3].filter(Boolean);
    const scored = this.items().map((it) => {
      let s = 0;
      const hits = [];
      want.forEach((w) => { if (it.tags.indexOf(w) > -1) { s++; hits.push(w); } });
      return { it: it, s: s, hits: hits };
    }).sort((a, b) => b.s - a.s || a.it.id - b.it.id);
    const words = { build: 'you like building things', talk: 'you like talking to people', move: 'you wanted to move', make: 'you wanted to make something', hour: 'it fits in an hour', evening: 'it is one evening', weekend: 'it eats a weekend', money: 'there is money or a credential in it', quiet: 'it is quiet' };
    return scored.slice(0, 3).map((r) => ({
      it: r.it,
      pct: Math.min(96, 58 + r.s * 13),
      reason: r.hits.length ? 'Because ' + r.hits.map((h) => words[h]).join(', and ') + '.' : 'Because you left the questions blank, so Bleep picked a popular one.'
    }));
  }

  view(it) {
    const sv = !!this.state.saved[it.id];
    return Object.assign({}, it, {
      onJoin: this.askToJoin(it),
      joinLabel: this.state.joined[it.id] ? 'Joined ✓' : 'Join',
      onSave: this.toggleSave(it),
      saveLabel: sv ? 'Saved' : 'Save',
      saveColor: sv ? 'var(--color-accent-200)' : 'color-mix(in srgb, var(--color-text) 76%, transparent)'
    });
  }

  renderVals() {
    const s = this.state;
    const ALL = this.items();
    const routes = ['home', 'discover', 'match', 'campus', 'careers', 'wellbeing', 'dashboard', 'redeem', 'week', 'board', 'post', 'social', 'problem'];
    const go = {};
    const cur = {};
    routes.forEach((r) => {
      go[r] = () => this.navTo(r);
      cur[r] = s.route === r ? 'page' : null;
    });

    const q = s.q.trim().toLowerCase();
    const timeKey = (w) => { const m = (w || "").match(/(\d{1,2}):(\d{2})/); return m ? (+m[1]) * 60 + (+m[2]) : 9999; };
    const results = ALL.filter((it) => !s.gone[it.id]).filter((it) => {
      if (s.emirate !== 'All' && it.emirate !== s.emirate) return false;
      if (s.cat !== 'All' && it.cat !== s.cat) return false;
      if (!q) return true;
      return (it.title + ' ' + it.blurb + ' ' + it.uni + ' ' + it.cat + ' ' + it.tags.join(' ')).toLowerCase().indexOf(q) > -1;
    }).map((it) => this.view(it));

    const campusAll = ALL.filter((it) => it.cat === 'Clubs' || it.cat === 'Events' || it.cat === 'Creative');
    const campusList = campusAll.filter((it) => s.emirate === 'All' || it.emirate === s.emirate).map((it) => this.view(it));

    // plate-carrée chart window: lon 51.40–57.00, lat 22.50–26.35, x squeezed by cos(24.7°)
    const mapNodes = [
      { label: 'Abu Dhabi', lon: 54.37, lat: 24.47, ax: 40, ay: 64 },
      { label: 'Dubai', lon: 55.27, lat: 25.20, ax: 37, ay: 41 },
      { label: 'Sharjah', lon: 55.39, lat: 25.35, ax: 40, ay: 31 },
      { label: 'Ajman', lon: 55.44, lat: 25.41, ax: 47, ay: 21 },
      { label: 'Umm Al Quwain', lon: 55.58, lat: 25.57, ax: 59, ay: 12 },
      { label: 'Ras Al Khaimah', lon: 55.95, lat: 25.79, ax: 77, ay: 4 },
      { label: 'Fujairah', lon: 56.33, lat: 25.13, ax: 93, ay: 47 }
    ].map((n) => {
      const px = (n.lon - 51.4) * 90.8, py = (26.35 - n.lat) * 100;
      const on = s.emirate === n.label;
      return {
        label: n.label, x: (px / 508) * 100, y: (py / 385) * 100, ax: n.ax, ay: n.ay,
        leader: 'M ' + px.toFixed(1) + ' ' + py.toFixed(1) + ' L ' + (n.ax * 5.08).toFixed(1) + ' ' + (n.ay * 3.85).toFixed(1),
        count: campusAll.filter((it) => it.emirate === n.label).length,
        aria: n.label + ', ' + campusAll.filter((it) => it.emirate === n.label).length + ' listings',
        fill: on ? 'var(--bot-d)' : 'var(--bot-b)',
        chipBg: on ? 'rgba(255,179,122,.75)' : 'rgba(247,241,224,.82)',
        ring: on ? 'inset 0 0 0 1.5px #23201a' : 'inset 0 0 0 1px rgba(35,32,26,.45)',
        onClick: () => this.setState({ emirate: n.label })
      };
    });

    const joinedItems = ALL.filter((it) => s.joined[it.id]);
    const doneCount = Object.keys(s.done).length;
    const level = Math.floor(s.xp / 250) + 1;
    const levelNames = ['Lurker', 'Attendee', 'Regular', 'Committee Risk', 'Campus Menace', 'Legend, Reportedly', 'Please Graduate'];
    const mood = this.MOODS.filter((m) => m.key === s.mood)[0];
    const answered = [s.m1, s.m2, s.m3].filter(Boolean).length;
    const quips = ['Manageable.', 'That is just a Thursday.', 'Pick one. Any one.', 'Suspiciously specific of you.'];
    const uniRec = this.UNIS.filter((u) => u.name === s.uni)[0] || this.UNIS[0];
    const surprise = s.surpriseId ? ALL.filter((it) => it.id === s.surpriseId)[0] : null;
    const todayName = this.DAYS[new Date().getDay()];
    const onToday = ALL.filter((it) => this.daysFor(it).indexOf(todayName) > -1);
    const pickItem = surprise || onToday[0] || ALL[0];
    const alsoToday = onToday.filter((it) => it.id !== pickItem.id).slice(0, 2);
    const pickIsToday = !!surprise
      ? this.daysFor(pickItem).indexOf(todayName) > -1
      : onToday.length > 0;
    const ticker = this.ITEMS.slice(0, 9).map((it) => ({ line: it.title.replace(/\.\s*$/, '') + '. ' + it.uni }));
    const dmUnread = s.dms.filter((d) => !d.mine && !d.read).length;
    const folioAll = this.NAV.map((n) => n.r);
    const folioIdx = Math.max(0, folioAll.indexOf(s.route));
    const folioNo = folioIdx + 1;
    const folioNext = folioIdx + 1 < folioAll.length
      ? 'Continued on page ' + (folioIdx + 2)
      : 'End of edition';
    const musicIndex = Math.max(0, this.MUSIC_TRACKS.map((t) => t.key).indexOf(s.track));
    const musicName = (this.MUSIC_TRACKS[musicIndex] || this.MUSIC_TRACKS[0]).name;
    const dmPids = s.dms.map((d) => d.pid).filter((p, i, arr) => arr.indexOf(p) === i);
    const dmWhoName = (s.dms.filter((d) => d.pid === s.dmOpenPid && !d.mine)[0] || { from: '' }).from;

    return {
      go: go, cur: cur,
      rootRef: this.rootRef, cursorRef: this.cursorRef, confettiRef: this.confettiRef,
      isHome: s.route === 'home', isDiscover: s.route === 'discover', isMatch: s.route === 'match',
      isCampus: s.route === 'campus', isCareers: s.route === 'careers',
      isWellbeing: s.route === 'wellbeing', isDashboard: s.route === 'dashboard',
      isRedeem: s.route === 'redeem', isProblem: s.route === 'problem',
      isWeek: s.route === 'week', isBoard: s.route === 'board', isPost: s.route === 'post',
      isSocial: s.route === 'social',

      c1: s.c1.toLocaleString('en-US'), c2: s.c2, c3: s.c3,
      botLine: this.BOT_LINES[s.botIdx],
      pokeBleep: () => {
        this.setState((st) => ({ botIdx: (st.botIdx + 1) % this.BOT_LINES.length, poked: st.poked + 1 }));
        clearTimeout(this.pokeTimer);
        this.pokeTimer = setTimeout(() => this.setState({ poked: 0 }), 950);
      },
      eyeAnim: s.poked ? 'y-squint .95s ease-in-out' : 'y-blink 4.2s ease-in-out infinite',
      headAnim: s.poked ? 'y-shake .55s ease-in-out' : 'y-bob 5s ease-in-out infinite',
      tickerA: ticker, tickerB: ticker,

      q: s.q,
      onQuery: (e) => this.setState({ q: e.target.value }),
      resetFilters: () => this.setState({ q: '', emirate: 'All', cat: 'All', surpriseId: null }),
      surpriseMe: () => {
        const pool = results.length ? results : this.items();
        const pick = pool[Math.floor(Math.random() * pool.length)];
        this.setState((st) => ({ surpriseId: pick.id, heroMood: 'rejected', snubs: st.snubs + 1 }));
        this.say('Bleep has another opinion.');
      },
      hasSurprise: !!surprise,
      surprise: surprise ? this.view(surprise) : {},
      emOptions: ['All'].concat(this.EMIRATES).map((e) => ({ v: e })),
      catOptions: ['All'].concat(this.CATS).map((c) => ({ v: c })),
      onEmirate: (e) => this.setState({ emirate: e.target.value }),
      onCat: (e) => this.setState({ cat: e.target.value }),
      scram: s.scram,
      view: s.view,
      isBoardView: s.view !== 'grid',
      isGridView: s.view === 'grid',
      setBoard: () => this.setState({ view: 'board' }),
      setGrid: () => this.setState({ view: 'grid' }),
      boardBg: s.view !== 'grid' ? 'var(--color-accent-300)' : 'transparent',
      boardFg: s.view !== 'grid' ? 'var(--color-on-accent)' : 'var(--color-accent-200)',
      gridBg: s.view === 'grid' ? 'var(--color-accent-300)' : 'transparent',
      gridFg: s.view === 'grid' ? 'var(--color-on-accent)' : 'var(--color-accent-200)',
      joinedTotal: Object.keys(s.joined).length,
      emirate: s.emirate === 'All' ? 'all 7 emirates' : s.emirate,
      results: results.slice().sort((x, y) => timeKey(x.when) - timeKey(y.when)).map((r, i) => Object.assign({}, r, {
        delay: (Math.min(i, 12) * 0.04).toFixed(2) + 's',
        num: String(i + 1).padStart(3, '0'),
        peel: s.peeling[r.id] ? 'peel .78s cubic-bezier(.45,0,.65,1) forwards' : 'none',
        tape: s.peeling[r.id] ? 'tape-snap .3s ease-in .1s forwards' : 'none',
        tilt: this.TILTS[i % this.TILTS.length],
        magnetBg: this.MAGNETS[i % this.MAGNETS.length],
        joinBg: s.joined[r.id] ? 'var(--color-accent-300)' : 'transparent',
        joinFg: s.joined[r.id] ? 'var(--color-on-accent)' : 'var(--color-accent-200)',
        magnetJoinBg: s.joined[r.id] ? '#14120c' : 'transparent',
        magnetJoinFg: s.joined[r.id] ? '#f5f2e7' : '#14120c'
      })),
      resultCount: results.length, noResults: results.length === 0,
      resultNoun: results.length === 1 ? 'thing matches.' : 'things match.',
      resultQuip: results.length === 0 ? '' : quips[results.length % 4],

      moodOpts: this.MOODS.map((m) => ({ key: m.key, label: m.label, checked: s.mood === m.key })),
      moodValue: s.mood || '',
      onMoodPick: (e) => this.pickMood(e.target.value),
      hasMood: !!mood,
      moodTitle: mood ? mood.title : '',
      moodMsg: mood ? mood.msg : '',
      moodSuggestion: mood ? mood.sug : '',

      q1opts: this.Q1.map((o) => ({ label: o.label, checked: s.m1 === o.key, onChange: () => this.setState({ m1: o.key, matched: false }) })),
      q2opts: this.Q2.map((o) => ({ label: o.label, checked: s.m2 === o.key, onChange: () => this.setState({ m2: o.key, matched: false }) })),
      q3opts: this.Q3.map((o) => ({ label: o.label, checked: s.m3 === o.key, onChange: () => this.setState({ m3: o.key, matched: false }) })),
      runMatch: () => { this.setState({ matched: true }); this.burst(); },
      matched: s.matched,
      matchHint: answered === 3 ? 'All three answered. Look at you.' : answered + ' of 3 answered. Bleep will guess the rest.',
      matchResults: this.matchFor().map((r) => Object.assign({}, this.view(r.it), { pct: r.pct, reason: r.reason })),

      campusList: campusList, campusEmpty: campusList.length === 0,
      campusHeading: (s.emirate === 'All' ? 'Everywhere' : s.emirate) + ' · ' + campusList.length + ' listings',
      showAllEmirates: () => this.setState({ emirate: 'All' }),
      mapNodes: mapNodes,

      careersList: ALL.filter((it) => it.cat === 'Careers' || it.cat === 'Startups').map((it, i) => {
        const taken = it.id % 5;
        const joined = !!s.joined[it.id];
        const gap = 'repeating-linear-gradient(45deg, #d9d0b6 0 3px, #d3c9ac 3px 6px)';
        return Object.assign({}, this.view(it), {
          flyerBg: this.MAGNETS[i % this.MAGNETS.length],
          tilt: this.TILTS[i % this.TILTS.length],
          proofLower: (function (p) { const q = p.replace(/\.\s*$/, ''); return q.charAt(0).toLowerCase() + q.slice(1) + '.'; })(it.proof),
          closes: (function (w) {
            const v = String(w || '').replace(/^closes\s*/i, '');
            // 'when' carries two kinds of value: a one-off application deadline,
            // or a recurrence pattern for a session that meets repeatedly
            return /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun|Daily|Ongoing|Every)/i.test(v)
              ? 'meets ' + v
              : 'closes ' + v;
          })(it.when),
          tabsLeft: joined ? 'You pulled one' : (6 - taken) + ' tabs left',
          tabs: Array.from({ length: 6 }, (_, k) => {
            const gone = k < taken || (joined && k === taken);
            return {
              label: gone ? '' : 'Apply',
              bg: gone ? gap : this.MAGNETS[i % this.MAGNETS.length],
              inset: gone ? 'inset 0 1px 4px rgba(0,0,0,.3)' : 'none',
              cursor: gone ? 'default' : 'pointer',
              title: gone ? 'Already taken' : 'Pull a tab to apply',
              onPull: gone ? () => {} : this.askToJoin(it)
            };
          })
        });
      }),
      proofList: joinedItems.map((it) => ({ line: it.proof.replace(/\.\s*$/, '') + '. ' + it.title + ', ' + it.uni })),
      proofEmpty: joinedItems.length === 0,
      wellList: ALL.filter((it) => it.cat === 'Wellbeing').map((it) => this.view(it)),
      moodTicks: this.MOODS.map((m) => {
        const on = s.mood === m.key;
        return {
          label: m.label, mark: on ? '\u2713' : '', pressed: on ? 'true' : 'false',
          bg: on ? 'rgba(255,179,122,.55)' : 'transparent',
          boxBg: on ? '#23201a' : 'transparent',
          ring: on ? 'inset 0 0 0 1.5px #23201a' : 'inset 0 0 0 1px rgba(35,32,26,.4)',
          onPick: () => this.pickMood(m.key)
        };
      }),
      wellRx: ALL.filter((it) => it.cat === 'Wellbeing').map((it, i) => Object.assign({}, this.view(it), {
        numeral: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'][i] || String(i + 1),
        rxBg: s.joined[it.id] ? '#23201a' : 'transparent',
        rxFg: s.joined[it.id] ? '#f7f1e0' : '#23201a'
      })),

      xp: s.xp, streak: s.mood === 'rough' ? 'paused' : s.streak,
      level: level, levelName: levelNames[Math.min(level - 1, levelNames.length - 1)],
      xpPct: Math.round(((s.xp % 250) / 250) * 100),
      xpToNext: 250 - (s.xp % 250),
      showQuests: this.props.gamified !== false,
      questList: this.QUESTS.map((qq) => ({ label: qq.label, xp: qq.xp, note: qq.note, done: !!s.done[qq.id], onToggle: this.toggleQuest(qq) })),
      badgeList: [
        { mark: 'I', name: 'Left the house', note: 'Joined one listing', op: joinedItems.length >= 1 ? 1 : 0.35 },
        { mark: 'II', name: 'Passport stamped', note: 'Something at another university', op: joinedItems.length >= 2 ? 1 : 0.35 },
        { mark: 'III', name: 'Quest gremlin', note: 'Three quests done', op: doneCount >= 3 ? 1 : 0.35 },
        { mark: 'IV', name: 'Overcommitted', note: 'Five things joined. Be careful', op: joinedItems.length >= 5 ? 1 : 0.35 }
      ],
      joinedList: joinedItems.map((it, i) => ({
        title: it.title, when: it.when, emirate: it.emirate,
        bg: this.MAGNETS[i % this.MAGNETS.length],
        tilt: this.TILTS[i % this.TILTS.length]
      })),
      joinedCount: joinedItems.length, joinedEmpty: joinedItems.length === 0,

      profile: {
        name: s.suName || 'Layla Al Mansoori',
        initials: (s.suName || 'Layla Al Mansoori').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase(), major: 'Computer Engineering', year: 3,
        uni: s.uni, emirate: uniRec.emirate,
        sid: s.lastSid || 'U20-448211',
        email: 'layla.a@' + (uniRec.name.indexOf('Sharjah') > -1 ? 'aus.edu' : 'uni.ac.ae')
      },
      uniOptions: this.UNIS.map((u) => ({ name: u.name })),
      onUniChange: (e) => this.setState({ uni: e.target.value }),

      rewardList: this.REWARDS.map((r, i) => ({
        id: r.id, kind: r.kind, title: r.title, cost: r.cost, brand: r.brand, terms: r.terms, blurb: r.blurb, code: r.code,
        isRedeemed: !!s.redeemed[r.id],
        canBuy: !s.redeemed[r.id] && s.xp >= r.cost,
        tooPoor: !s.redeemed[r.id] && s.xp < r.cost,
        short: Math.max(0, r.cost - s.xp),
        couponBg: this.MAGNETS[i % this.MAGNETS.length],
        serial: 'LP-' + String(100 + r.cost),
        stubAnim: s.tearing[r.id]
          ? 'coupon-tear .72s cubic-bezier(.3,.6,.4,1) both'
          : (s.redeemed[r.id] ? 'y-pop .3s ease-out both' : 'none'),
        bodyAnim: s.tearing[r.id] ? 'coupon-shake .42s ease-in-out both' : 'none',
        stubBg: s.redeemed[r.id] && !s.tearing[r.id] ? 'rgba(0,0,0,.14)' : 'rgba(0,0,0,.05)',
        stubLabel: s.redeemed[r.id] && !s.tearing[r.id] ? 'Used' : r.cost + ' XP',
        stubOpacity: s.redeemed[r.id] && !s.tearing[r.id] ? '.5' : '1',
        onRedeem: this.redeem(r)
      })),

      showIdModal: !!s.pending,
      pendingTitle: s.pending ? s.pending.title : '',
      sidInput: s.sidInput, sidError: s.sidError,
      onSid: (e) => this.setState({ sidInput: e.target.value, sidError: false }),
      submitId: this.submitId,
      closeModal: () => this.setState({ pending: null, sidError: false }),
      showSuccess: s.showSuccess, lastSid: s.lastSid,
      stopClick: (e) => e.stopPropagation(),
      closeSuccess: () => this.setState({ showSuccess: false }),
      successToDash: () => this.navTo('dashboard', { showSuccess: false }),

      routeLabel: (this.NAV.filter((n) => n.r === s.route)[0] || { l: 'Home' }).l,
      liveCount: ALL.length,
      gridSpin: s.menuOpen ? 'rotate(45deg)' : 'none',
      quickNav: [
        { r: 'discover', l: 'Discover' },
        { r: 'week', l: 'This week' },
        { r: 'problem', l: 'Problem & Solution' }
      ].map((n) => ({
        label: n.l,
        fg: s.route === n.r ? 'var(--color-accent-100)' : 'color-mix(in srgb, var(--color-text) 78%, transparent)',
        onGo: () => this.navTo(n.r, { menuOpen: false })
      })),
      menuOpen: s.menuOpen,
      menuExpanded: s.menuOpen ? 'true' : 'false',
      menuLabel: s.menuOpen ? 'Close' : 'Menu',
      menuBtnBg: s.menuOpen ? 'var(--color-accent-300)' : 'transparent',
      menuBtnFg: s.menuOpen ? 'var(--color-on-accent)' : 'var(--color-accent-200)',
      barTop: s.menuOpen ? 'translateY(5px) rotate(45deg)' : 'none',
      barMid: s.menuOpen ? 0 : 1,
      barBot: s.menuOpen ? 'translateY(-5px) rotate(-45deg)' : 'none',
      toggleMenu: () => this.setState((st) => ({ menuOpen: !st.menuOpen })),
      menuCount: this.NAV.filter((n) => n.r !== 'dashboard').length,
      heroBotAnim: s.calm ? 'none' : 'y-bob 4.6s ease-in-out infinite',
      pick: this.view(pickItem),
      pickWhere: pickItem.uni + ', ' + pickItem.emirate + '.',
      pickCta: s.joined[pickItem.id] ? 'Already going ✓' : 'Fine, I will go',
      pickKicker: pickIsToday ? "Tonight's pick" : 'Next thing worth leaving for',
      kickerNote: pickIsToday ? 'On tonight, hence the fuss.' : 'Not tonight, but close enough to plan for.',
      pickStamp: 'Chosen for you at ' + (function () {
        const d = new Date();
        return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
      })(),
      heroLine: (function () {
        if (s.heroMood === 'joined') return this.JOINED_LINES[pickItem.id % this.JOINED_LINES.length];
        if (s.heroMood === 'rejected') return this.SNUB_LINES[s.snubs % this.SNUB_LINES.length];
        const cat = (pickItem.cat || '').toLowerCase();
        const byCat = {
          clubs: 'A club. Which means a room, some chairs, and people who already know each other. Push through.',
          events: 'An event. Loose, low-commitment, easy to leave early. Ideal for a coward. No offence.',
          careers: 'This one is technically good for you. I know. I hate it too.',
          startups: 'Somebody will say "disrupt" within ten minutes. Go anyway, the snacks are usually decent.',
          academics: 'Studying, but with witnesses. Turns out that works on almost everyone.',
          creative: 'Creative. Nobody there is good yet either. That is rather the point of turning up.',
          wellbeing: 'This is the gentle one. No talking required. You can leave whenever.'
        };
        const sporty = /padel|run|basketball|football|swim|climb|yoga|court|5km/i.test(pickItem.title || '');
        if (sporty) return 'Sport. You will sweat, you will lose, you will be invited back. That is the deal.';
        return byCat[cat] || this.BOT_LINES[s.botIdx % this.BOT_LINES.length];
      }).call(this),
      alsoLabel: alsoToday.length ? 'Also on tonight' : 'Also this week',
      alsoLine: (function () {
        const say = (list) => list.map((it) => it.title.replace(/\.\s*$/, '').toLowerCase() + ', ' + it.when).join(' · ');
        if (alsoToday.length) return say(alsoToday);
        const rest = ALL.filter((it) => it.id !== pickItem.id).slice(0, 2);
        return rest.length ? say(rest) : 'nothing else, genuinely. rare gift.';
      })(),
      heroEyeAnim: s.calm ? 'none' : 'y-blink 5.4s ease-in-out infinite',
      folio: folioNo,
      folioTotal: folioAll.length,
      folioNext: folioNext,
      weatherLine: (() => {
        const h = new Date().getHours(), m = new Date().getMonth();
        // Gulf climate, not a forecast: warm most of the year, brutal June to September
        const summer = m >= 5 && m <= 8, winter = m === 11 || m <= 1;
        const base = summer ? 41 : (winter ? 24 : 33);
        const temp = base - (h < 7 ? 5 : (h > 20 ? 3 : 0));
        const sky = summer ? 'hazy' : (winter ? 'clear' : 'warm');
        const night = h >= 19 || h < 6;
        const n = onToday.length;
        return 'Sharjah, ' + temp + '°, ' + (night ? sky + ' night' : sky) + '. ' + (n === 0 ? 'Nothing on tonight.' : n + (n === 1 ? ' thing' : ' things') + ' on tonight.');
      })(),
      todayLine: (function () {
        const d = new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const mo = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return days[d.getDay()] + ', ' + d.getDate() + ' ' + mo[d.getMonth()] + ' ' + d.getFullYear();
      })(),
      receiptWeek: 'WEEK ' + (6 + Math.floor(Object.keys(s.joined).length / 2)),
      receiptTotal: 36 - Object.keys(s.joined).length,
      receiptRows: [
        { qty: '1', item: 'Padel, 4 spots short', cost: 'a friend' },
        { qty: '1', item: 'Board games, no Monopoly', cost: 'a Tuesday' },
        { qty: '2', item: 'Beach cleans, Ajman', cost: '2 hrs karma' },
        { qty: '1', item: 'Robotics build night', cost: 'a CV line' },
        { qty: '1', item: 'Open mic, three chords', cost: 'the story' },
        { qty: '30', item: 'Other things entirely', cost: 'unknown' }
      ].map((r, i) => Object.assign({}, r, { delay: (0.65 + i * 0.13).toFixed(2) + 's' })),
      barcode: this.BARS,
      glowRef: this.glowRef,
      toggleMusic: this.toggleMusic,
      musicLabel: s.music ? musicName : 'Music off',
      musicHint: musicIndex + 1 + ' of ' + this.MUSIC_TRACKS.length + ' ›',
      musicHintShow: s.music ? 'inline-block' : 'none',
      musicTitle: s.music ? 'Playing ' + musicName + '. Click for the next ambience, or silence.' : 'Play a quiet background pad. Click again to change it.',
      musicPressed: s.music ? 'true' : 'false',
      musicBg: s.music ? 'var(--color-accent-300)' : 'transparent',
      musicFg: s.music ? 'var(--color-on-accent)' : 'var(--color-accent-200)',
      musicBorder: s.music ? 'var(--color-accent-300)' : 'color-mix(in srgb, var(--color-accent-400) 55%, transparent)',
      calmFlag: s.calm ? '1' : '0',
      turnFlag: s.turning ? '1' : '0',
      calmPressed: s.calm ? 'true' : 'false',
      calmLabel: s.calm ? 'Motion off' : 'Motion on',
      calmTitle: s.calm ? 'Turn animations back on' : 'Turn off animations, scanlines and the roaming bot',
      calmBg: s.calm ? 'var(--color-accent-300)' : 'transparent',
      calmFg: s.calm ? 'var(--color-on-accent)' : 'var(--color-accent-200)',
      calmBorder: s.calm ? 'var(--color-accent-300)' : 'color-mix(in srgb, var(--color-accent-400) 55%, transparent)',
      toggleCalm: () => this.setState((st) => ({ calm: !st.calm })),
      popBlend: s.palette === 'monolight' ? 'multiply' : 'screen',

      peopleCount: this.PEOPLE.length,
      connectedCount: Object.keys(s.connected).length,
      interestChips: ['All'].concat(this.INTERESTS).map((c) => ({
        label: c,
        bg: s.interest === c ? 'var(--color-accent-300)' : 'transparent',
        fg: s.interest === c ? 'var(--color-on-accent)' : 'var(--color-accent-200)',
        onPick: () => this.setState({ interest: c, conIdx: 0 })
      })),
      conReel: (function (self) {
        const pool = self.PEOPLE.filter((p) => s.interest === 'All' || p.tags.indexOf(s.interest) > -1);
        if (!pool.length) return [];
        const i = s.conIdx % pool.length;
        // two slivers each side, nearer ones taller, exactly like a reel of cards
        return [2, 1].map((off) => {
          const p = pool[(i - off + pool.length * 2) % pool.length];
          return {
            initials: p.name.split(' ').map((w) => w[0]).join(''),
            title: p.name + ', ' + p.year,
            w: off === 1 ? '46px' : '32px',
            h: off === 1 ? '176px' : '112px',
            bg: self.MAGNETS[(i - off + pool.length * 2) % self.MAGNETS.length],
            shadow: off === 1 ? '0 8px 20px rgba(0,0,0,.22)' : '0 5px 13px rgba(0,0,0,.18)',
            op: off === 1 ? '.9' : '.6',
            onPick: () => self.setState({ conIdx: (i - off + pool.length * 2) % pool.length })
          };
        });
      })(this),
      conReelRight: (function (self) {
        const pool = self.PEOPLE.filter((p) => s.interest === 'All' || p.tags.indexOf(s.interest) > -1);
        if (!pool.length) return [];
        const i = s.conIdx % pool.length;
        return [1, 2].map((off) => {
          const p = pool[(i + off) % pool.length];
          return {
            initials: p.name.split(' ').map((w) => w[0]).join(''),
            title: p.name + ', ' + p.year,
            w: off === 1 ? '46px' : '32px',
            h: off === 1 ? '176px' : '112px',
            bg: self.MAGNETS[(i + off) % self.MAGNETS.length],
            shadow: off === 1 ? '0 8px 20px rgba(0,0,0,.22)' : '0 5px 13px rgba(0,0,0,.18)',
            op: off === 1 ? '.9' : '.6',
            onPick: () => self.setState({ conIdx: (i + off) % pool.length })
          };
        });
      })(this),
      conPerson: (function (self) {
        const pool = self.PEOPLE.filter((p) => s.interest === 'All' || p.tags.indexOf(s.interest) > -1);
        const p = pool[s.conIdx % (pool.length || 1)] || self.PEOPLE[0];
        return Object.assign({}, self.person(p), { panel: self.MAGNETS[(s.conIdx % (pool.length || 1)) % self.MAGNETS.length] });
      })(this),
      conCounter: (function (self) {
        const n = self.PEOPLE.filter((p) => s.interest === 'All' || p.tags.indexOf(s.interest) > -1).length;
        return 'Person ' + ((s.conIdx % (n || 1)) + 1) + ' of ' + n;
      })(this),
      conDots: this.PEOPLE.filter((p) => s.interest === 'All' || p.tags.indexOf(s.interest) > -1).map((x, i) => ({
        bg: i === s.conIdx % this.PEOPLE.filter((p) => s.interest === 'All' || p.tags.indexOf(s.interest) > -1).length
          ? 'var(--color-text)' : 'color-mix(in srgb, var(--color-text) 26%, transparent)',
        onPick: () => this.setState({ conIdx: i })
      })),
      conNext: () => {
        const n = this.PEOPLE.filter((p) => s.interest === 'All' || p.tags.indexOf(s.interest) > -1).length || 1;
        this.setState({ conIdx: (s.conIdx + 1) % n });
      },
      conPrev: () => {
        const n = this.PEOPLE.filter((p) => s.interest === 'All' || p.tags.indexOf(s.interest) > -1).length || 1;
        this.setState({ conIdx: (s.conIdx - 1 + n) % n });
      },

      peopleList: this.PEOPLE
        .filter((p) => s.interest === 'All' || p.tags.indexOf(s.interest) > -1)
        .map((p, i) => Object.assign({}, this.person(p), { delay: (Math.min(i, 10) * 0.04).toFixed(2) + 's' })),
      noPeople: this.PEOPLE.filter((p) => s.interest === 'All' || p.tags.indexOf(s.interest) > -1).length === 0,

      hasAttendees: s.attendees.length > 0,
      attendeeCount: s.attendees.length,
      attendees: s.attendees.map((id) => {
        const p = this.PEOPLE.filter((x) => x.id === id)[0];
        return Object.assign({}, this.person(p), { tagLine: p.tags.join(' · ') });
      }),
      goDash: () => this.navTo('dashboard', { menuOpen: false }),
      dashInitials: (s.suName || 'Layla Al Mansoori').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase(),
      dashBg: s.route === 'dashboard' ? 'color-mix(in srgb, var(--color-accent-400) 22%, transparent)' : 'transparent',
      dashBorder: s.route === 'dashboard' ? 'var(--color-accent-300)' : 'color-mix(in srgb, var(--color-accent-400) 55%, transparent)',
      dashFg: s.route === 'dashboard' ? 'var(--color-accent-100)' : 'var(--color-accent-200)',
      menuItems: this.NAV.filter((n) => n.r !== 'dashboard').map((n, i) => ({
        num: (i + 1 < 10 ? '0' : '') + (i + 1),
        label: n.l, note: n.n,
        bg: s.route === n.r ? 'color-mix(in srgb, var(--color-accent-400) 18%, transparent)' : 'transparent',
        border: s.route === n.r ? 'var(--color-accent-300)' : 'color-mix(in srgb, var(--color-accent-500) 60%, transparent)',
        fg: s.route === n.r ? 'var(--color-accent-100)' : 'var(--color-text)',
        onGo: () => this.navTo(n.r, { menuOpen: false })
      })),
      openSignupFromMenu: () => this.setState({ showSignup: true, menuOpen: false }),
      postFromMenu: () => this.navTo('post', { menuOpen: false }),

      paletteSwatches: this.PALETTES.map((p) => ({
        name: p.name, dot: p.c[2],
        ring: s.palette === p.key ? '0 0 0 2px var(--color-bg), 0 0 0 4px ' + p.c[2] : '0 0 0 1px rgba(233,233,237,.35)',
        onPick: () => { this.setState({ palette: p.key }); this.say(p.name + '. Bold.'); }
      })),



      intro: s.intro,
      gateLine: this.INTRO[Math.min(this.INTRO.length - 1, s.introStep)],
      gateStatus: s.gatePct >= 100 ? 'UNLOCKED' : 'LOCKED',
      gateCounter: 'LINE ' + Math.min(this.INTRO.length, s.introStep + 1) + '/' + this.INTRO.length,
      gatePct: s.gatePct,
      gateBtnLabel: s.gatePct >= 100 ? 'ENTER' : (s.introStep < this.INTRO.length - 1 ? 'HOLD TO CONTINUE' : 'HOLD TO UNLOCK'),
      gateBtnColor: s.gatePct > 52 ? 'var(--color-on-accent)' : 'var(--color-accent-200)',
      gateHint: s.holding ? 'keep holding…' : (s.introStep < this.INTRO.length - 1 ? 'press and hold the bar' : 'one more hold and you are in'),
      gateBotAnim: s.holding ? 'y-shake .55s ease-in-out infinite' : 'y-bob 3.6s ease-in-out infinite',
      gateEyeAnim: s.holding ? 'y-squint .95s ease-in-out infinite' : 'y-blink 3.2s ease-in-out infinite',
      holdStart: (e) => {
        if (e && e.preventDefault) e.preventDefault();
        try { if (e && e.pointerId != null) e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
        this.holdStart();
      },
      noContext: (e) => { if (e && e.preventDefault) e.preventDefault(); },
      gateEnter: () => this.setState({ intro: false, holding: false, gatePct: 100 }),
      holdKeyDown: (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          this.setState({ intro: false, holding: false });
        }
      },
      holdEnd: () => this.holdEnd(),
      startApp: () => this.setState({ intro: false }),

      showBuddy: !s.buddyHidden && !s.intro,
      buddyHidden: s.buddyHidden && !s.intro,
      buddyOpen: s.buddyOpen,
      buddyWander: s.buddyOpen ? 'none' : 'y-wander 46s ease-in-out infinite',
      buddyEyeAnim: (function () {
        if (s.mood === 'rough' || s.mood === 'flat') return 'none';
        if (s.mood === 'good') return 'y-breathe 1.6s ease-in-out infinite';
        return 'y-blink 4.8s ease-in-out infinite';
      })(),
      buddyEyeY: s.mood === 'busy' ? '26px' : (s.mood === 'flat' ? '24px' : '22px'),
      buddyEyeH: s.mood === 'busy' ? '5px' : (s.mood === 'flat' || s.mood === 'rough' ? '9px' : '14px'),
      buddyMouth: (s.mood === 'rough' || s.mood === 'flat') ? '8px 8px 0 0' : (s.mood === 'busy' ? '0' : '0 0 8px 8px'),
      buddyMouthY: s.mood === 'good' ? '10px' : '13px',
      moodBotAnim: (s.mood === 'rough' || s.mood === 'flat') ? 'none' : (s.mood === 'good' ? 'y-bob 2.2s ease-in-out infinite' : 'y-bob 4.4s ease-in-out infinite'),
      moodEyeY: s.mood === 'busy' ? '32px' : (s.mood === 'flat' ? '30px' : '27px'),
      moodEyeH: s.mood === 'busy' ? '6px' : (s.mood === 'flat' || s.mood === 'rough' ? '11px' : '18px'),
      moodMouthY: s.mood === 'good' ? '13px' : '17px',
      moodMouthW: s.mood === 'busy' ? '14px' : (s.mood === 'good' ? '28px' : '22px'),
      cuties: s.cuties, hasCuties: s.cuties.length > 0,
      moodBloopLine: {
        good: 'Look at you. I am matching your energy and it is exhausting.',
        fine: 'Fine is my favourite answer. Nothing is on fire.',
        busy: 'Squinting in solidarity. Nothing social until Sunday.',
        flat: 'Same. We will aim very low together.',
        rough: 'I have stopped bobbing. Take your time.'
      }[s.mood] || '',
      buddyMouthW: s.mood === 'busy' ? '11px' : (s.mood === 'good' ? '22px' : '17px'),
      buddyBob: s.buddyOpen ? 'none' : 'y-bob 4.6s ease-in-out infinite',
      buddyLine: (this.BUDDY[s.route] || this.BUDDY.home)[s.buddyIdx % (this.BUDDY[s.route] || this.BUDDY.home).length],
      toggleBuddy: () => this.setState((st) => ({ buddyOpen: !st.buddyOpen })),
      nextBuddyLine: () => this.setState((st) => ({ buddyIdx: st.buddyIdx + 1 })),
      hideBuddy: () => this.setState({ buddyHidden: true, buddyOpen: false }),
      unhideBuddy: () => this.setState({ buddyHidden: false, buddyOpen: true }),

      problemChat: this.PROBLEM_CHAT.map((m, i) => ({
        who: m.who === 'bleep' ? 'Bleep' : 'Bloop', text: m.text,
        dir: m.who === 'bleep' ? 'row' : 'row-reverse',
        radius: m.who === 'bleep' ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
        bg: m.who === 'bleep' ? 'var(--color-surface)' : 'color-mix(in srgb, var(--color-accent-400) 16%, var(--color-surface))',

        blink: (3.4 + i * 0.4).toFixed(1) + 's',
        delay: (i * 0.11).toFixed(2) + 's'
      })),
      psStats: [
        { v: s.psN[0].toLocaleString('en-US'), label: 'students in UAE universities', src: 'Ministry of Higher Education, via WAM, 2026', icon: 'ph-student' },
        { v: s.psN[1], label: 'separate institutions', src: 'Ministry of Higher Education, via WAM, 2026', icon: 'ph-buildings' },
        { v: s.psN[2] + '%', label: 'international students in Dubai\u2019s private universities', src: 'KHDA, 2024–25', icon: 'ph-globe-hemisphere-east' }
      ],
      survey: this.SURVEY.map((b, i) => {
        const on = !!s.revealed[i];
        return {
          label: b.label,
          shown: on ? b.pct + '%' : '??',
          numColor: on ? 'var(--color-accent-200)' : 'color-mix(in srgb, var(--color-text) 34%, transparent)',
          hint: on ? 'of 148 asked' : 'tap to reveal',
          onReveal: () => {
            const r = Object.assign({}, this.state.revealed);
            r[i] = !r[i];
            this.setState({ revealed: r });
          }
        };
      }),
      probPins: this.pins(this.PROB_PINS),
      probLines: this.thread(this.PROB_PINS.length),
      resPins: this.pins(this.RES_PINS),
      resLines: this.thread(this.RES_PINS.length),
      solPins: this.pins(this.SOL_PINS),
      solLines: this.thread(this.SOL_PINS.length),
      findings: this.FINDINGS.map((fi, i) => ({
        num: String(i + 1).padStart(2, '0'),
        stat: fi.stat, label: fi.label, tells: fi.tells, src: fi.src,
        open: s.findOpen === i,
        expanded: s.findOpen === i ? 'true' : 'false',
        spin: s.findOpen === i ? 'rotate(45deg)' : 'none',
        bg: s.findOpen === i ? 'color-mix(in srgb, var(--color-text) 7%, transparent)' : 'transparent',
        onToggle: () => this.setState({ findOpen: s.findOpen === i ? null : i })
      })),
      solCard: this.SOL_CARDS[s.solCard],
      solCounter: (s.solCard + 1) + ' of ' + this.SOL_CARDS.length,
      solNext: () => this.setState((st) => ({ solCard: (st.solCard + 1) % this.SOL_CARDS.length })),
      solPrev: () => this.setState((st) => ({ solCard: (st.solCard - 1 + this.SOL_CARDS.length) % this.SOL_CARDS.length })),
      solDots: this.SOL_CARDS.map((c, i) => ({
        bg: i === s.solCard ? 'var(--color-accent-200)' : 'color-mix(in srgb, var(--color-text) 22%, transparent)',
        onPick: () => this.setState({ solCard: i })
      })),
      persona: this.PERSONAS[s.pIdx % this.PERSONAS.length],
      personaCounter: (s.pIdx % this.PERSONAS.length + 1) + ' of ' + this.PERSONAS.length,
      personaPrev: () => this.setState({ pIdx: (s.pIdx - 1 + this.PERSONAS.length) % this.PERSONAS.length }),
      personaNext: () => this.setState({ pIdx: (s.pIdx + 1) % this.PERSONAS.length }),
      personaDots: this.PERSONAS.map((x, i) => ({
        bg: i === s.pIdx % this.PERSONAS.length ? 'var(--color-accent-200)' : 'color-mix(in srgb, var(--color-text) 26%, transparent)',
        onPick: () => this.setState({ pIdx: i })
      })),

      whyCard: (function (self) {
        const i = s.wIdx % self.WHY.length;
        const w = self.WHY[i];
        return {
          n: w.n, title: w.title, body: w.body, stat: w.stat,
          icon: ['ph-dice-five', 'ph-hand-heart', 'ph-trend-up', 'ph-medal'][i] || 'ph-sparkle'
        };
      })(this),
      whyCounter: (s.wIdx % this.WHY.length + 1) + ' of ' + this.WHY.length,
      whyPrev: () => this.setState({ wIdx: (s.wIdx - 1 + this.WHY.length) % this.WHY.length }),
      whyNext: () => this.setState({ wIdx: (s.wIdx + 1) % this.WHY.length }),
      whyDots: this.WHY.map((x, i) => ({
        bg: i === s.wIdx % this.WHY.length ? 'var(--color-accent-200)' : 'color-mix(in srgb, var(--color-text) 26%, transparent)',
        onPick: () => this.setState({ wIdx: i })
      })),

      weekCols: this.DAYS.map((d, di) => {
        const list = ALL.filter((it) => this.daysFor(it).indexOf(d) > -1)
          .map((it) => Object.assign({}, it, { time: this.timeFor(it) }))
          .sort((x, y) => {
            const dx = /^(Daily|Ongoing)/i.test(x.when || '') ? 1 : 0;
            const dy = /^(Daily|Ongoing)/i.test(y.when || '') ? 1 : 0;
            if (dx !== dy) return dx - dy;
            return x.time > y.time ? 1 : -1;
          });
        const on = s.day === d;
        return {
          label: d,
          headBg: on ? 'var(--color-accent-300)' : (di > 4 ? 'var(--color-text)' : 'var(--color-surface)'),
          headFg: on || di > 4 ? 'var(--color-bg)' : 'var(--color-text)',
          headRing: on ? 'inset 0 0 0 2px var(--color-text)' : 'none',
          onPick: () => this.setState({ day: d }),
          blur: on ? 'none' : 'blur(1.8px)',
          dim: on ? '1' : '.5',
          empty: list.length === 0,
          notes: list.map((it, i) => ({
            time: it.time, title: it.title, emirate: it.emirate,
            bg: /^(Daily|Ongoing)/i.test(it.when || '') ? '#efe9d8' : this.MAGNETS[(di + i) % this.MAGNETS.length],
            tilt: this.TILTS[(di * 2 + i) % this.TILTS.length],
            onPick: this.askToJoin(it)
          }))
        };
      }),
      weekDays: this.DAYS.map((d) => {
        const n = ALL.filter((it) => this.daysFor(it).indexOf(d) > -1).length;
        const on = s.day === d;
        return {
          label: d, count: n, noun: n === 1 ? 'thing' : 'things',
          bg: on ? 'var(--color-accent-300)' : 'var(--color-surface)',
          fg: on ? 'var(--color-bg)' : 'var(--color-text)',
          ring: on ? '0 8px 20px rgba(0,0,0,.4)' : 'var(--shadow-sm)',
          onPick: () => this.setState({ day: d })
        };
      }),
      weekList: ALL.filter((it) => this.daysFor(it).indexOf(s.day) > -1)
        .map((it) => Object.assign({}, this.view(it), { time: this.timeFor(it) }))
        .sort((a, b) => (a.time > b.time ? 1 : -1)),
      weekHeading: s.day === 'Fri' || s.day === 'Sat' ? s.day + ', weekend' : s.day,
      weekQuip: s.day === 'Sun' ? 'Back to it.' : s.day === 'Thu' ? 'Peak campus chaos.' : 'No excuses available.',
      weekEmpty: ALL.filter((it) => this.daysFor(it).indexOf(s.day) > -1).length === 0,
      savedList: ALL.filter((it) => s.saved[it.id]).map((it) => this.view(it)),
      savedCount: Object.keys(s.saved).length,
      hasSaved: Object.keys(s.saved).length > 0,
      noSaved: Object.keys(s.saved).length === 0,

      boardScopes: ['Everywhere', 'My university'].map((b) => ({
        label: b, checked: s.scope === b, onChange: () => this.setState({ scope: b })
      })),
      liveFeed: s.liveFeed,
      boardRows: (function (self) {
        const me = { name: (s.suName ? 'You (' + s.suName + ')' : 'You (Layla Al Mansoori)'), uni: s.uni, xp: s.xp, me: true };
        let rows = self.PEERS.map((p) => ({ name: p.name, uni: p.uni, xp: p.xp + (s.boardBonus[p.name] || 0), d: s.boardDelta[p.name] })).concat([me]);
        if (s.scope === 'My university') rows = rows.filter((r) => r.uni === s.uni || r.me);
        rows.sort((a, b) => b.xp - a.xp);
        return rows.map((r, i) => ({
          rank: i + 1, name: r.name, uni: r.uni, xp: r.xp.toLocaleString('en-US'),
          delta: r.d ? '+' + r.d : '',
          bg: i === 0 ? '#ffb37a' : (i === 1 ? '#bfe9e1' : (i === 2 ? '#e6dfc9' : (r.me ? 'color-mix(in srgb, var(--color-accent-400) 18%, var(--color-surface))' : 'var(--color-surface)'))),
          ring: i < 3 ? '0 10px 24px rgba(0,0,0,.26)' : (r.me ? 'var(--shadow-sm), 0 0 0 1px var(--color-accent-300)' : 'var(--shadow-sm)'),
          fg: i < 3 ? '#14120c' : 'var(--color-text)',
          subFg: i < 3 ? 'rgba(20,18,12,.72)' : 'color-mix(in srgb, var(--color-text) 72%, transparent)',
          xpFg: i < 3 ? '#14120c' : 'var(--color-accent-200)',
          deltaFg: i < 3 ? 'rgba(20,18,12,.66)' : 'var(--color-accent-300)',
          badgeBg: i === 0 ? '#14120c' : (i === 1 ? '#14120c' : (i === 2 ? '#14120c' : 'transparent')),
          badgeFg: i === 0 ? '#ffb37a' : (i === 1 ? '#bfe9e1' : (i === 2 ? '#e6dfc9' : 'color-mix(in srgb, var(--color-text) 72%, transparent)')),
          badgeClip: i < 3 ? 'polygon(0 0, 100% 0, 100% 74%, 50% 100%, 0 74%)' : 'none',
          badgeIcon: i === 0 ? 'ph-duotone ph-trophy' : (i === 1 ? 'ph-duotone ph-medal' : (i === 2 ? 'ph-duotone ph-seal-check' : 'ph ph-dot-outline'))
        }));
      })(this),
      boardNote: (function (self) {
        const live = self.PEERS.map((p) => p.xp + (s.boardBonus[p.name] || 0));
        const above = live.filter((v) => v > s.xp).length;
        if (above === 0) return 'First place. Please consider attending a lecture at some point.';
        const gap = live.filter((v) => v > s.xp).sort((a, b) => a - b)[0] - s.xp + 1;
        return 'You are ' + (above + 1) + 'th. ' + gap + ' XP would move you up one place, that is roughly two events and a quest.';
      })(this),

      postCats: this.CATS.map((c) => ({ v: c })),
      pTitle: s.pTitle, pCat: s.pCat, pUni: s.pUni, pWhen: s.pWhen, pBlurb: s.pBlurb, pError: s.pError,
      onPTitle: (e) => this.setState({ pTitle: e.target.value, pError: false }),
      onPCat: (e) => this.setState({ pCat: e.target.value }),
      onPUni: (e) => this.setState({ pUni: e.target.value }),
      onPWhen: (e) => this.setState({ pWhen: e.target.value, pError: false }),
      onPBlurb: (e) => this.setState({ pBlurb: e.target.value }),
      submitPost: this.submitPost,
      mineList: s.posted.map((m, i) => ({
        title: m.title, cat: m.cat, uni: m.uni, when: m.when,
        onRemove: () => {
          const posted = s.posted.slice();
          posted.splice(i, 1);
          this.setState({ posted: posted });
          this.say('Taken down. It never happened.');
        }
      })),
      mineCount: s.posted.length, hasMine: s.posted.length > 0, noMine: s.posted.length === 0,

      friendInput: s.friendInput,
      onFriend: (e) => this.setState({ friendInput: e.target.value }),
      hasFriend: !!s.lastFriend, lastXp: s.lastXp,
      friendNote: s.lastFriend ? s.lastFriend + ' has been emailed too. +10 bonus XP for dragging someone out.' : '',

      chatLog: (s.chat.length ? s.chat : [{ who: 'bloop', text: this.BUDDY[s.route] ? this.BUDDY[s.route][0] : this.BUDDY.home[0] }]).map((c) => ({
        text: c.text,
        align: c.who === 'me' ? 'flex-end' : 'flex-start',
        bg: c.who === 'me' ? 'var(--color-accent-300)' : 'color-mix(in srgb, var(--color-text) 8%, transparent)',
        fg: c.who === 'me' ? 'var(--color-bg)' : 'var(--color-text)'
      })),
      chatInput: s.chatInput,
      onChatInput: (e) => this.setState({ chatInput: e.target.value }),
      onChatKey: (e) => { if (e.key === 'Enter') this.ask(this.state.chatInput); },
      sendChat: () => this.ask(this.state.chatInput),
      chatChips: this.CHAT_CHIPS.map((q) => ({ label: q, onAsk: () => this.ask(q) })),

      chatMode: !s.dmTab,
      dmListMode: s.dmTab && !s.dmOpenPid,
      dmChatMode: s.dmTab && !!s.dmOpenPid,
      dmEmpty: s.dmTab && !s.dmOpenPid && s.dms.length === 0,
      dmUnread: dmUnread,
      hasUnread: dmUnread > 0,
      dmBadge: dmUnread > 0 ? ' (' + dmUnread + ')' : '',
      hasDmAlert: dmUnread > 0 && !s.dmSeen && !s.buddyOpen && !s.buddyHidden,
      dmAlertName: (s.dms.filter((d) => !d.mine && !d.read).slice(-1)[0] || { from: 'Someone' }).from,
      chatTabBg: s.dmTab ? 'transparent' : 'var(--color-accent-300)',
      chatTabFg: s.dmTab ? 'var(--color-accent-200)' : 'var(--color-on-accent)',
      chatTabRing: s.dmTab ? 'inset 0 0 0 1px var(--color-accent-500)' : 'none',
      dmTabBg: s.dmTab ? 'var(--color-accent-300)' : 'transparent',
      dmTabFg: s.dmTab ? 'var(--color-on-accent)' : 'var(--color-accent-200)',
      dmTabRing: s.dmTab ? 'none' : 'inset 0 0 0 1px var(--color-accent-500)',
      showChatTab: () => this.setState({ dmTab: false }),
      showDmTab: () => this.setState({ dmTab: true, dmSeen: true }),
      openDms: () => {
        const last = s.dms.filter((d) => !d.mine && !d.read).slice(-1)[0];
        this.setState({
          buddyOpen: true, dmTab: true, dmSeen: true,
          dmOpenPid: last ? last.pid : '',
          dms: last ? s.dms.map((d) => (d.pid === last.pid ? Object.assign({}, d, { read: true }) : d)) : s.dms
        });
      },
      dismissDm: () => this.setState({ dmSeen: true }),
      dmBack: () => this.setState({ dmOpenPid: '' }),
      dmList: dmPids.map((pid, i) => {
        const msgs = s.dms.filter((d) => d.pid === pid);
        const them = msgs.filter((d) => !d.mine);
        const unread = them.filter((d) => !d.read).length;
        const who = (them[0] || { from: '?' }).from;
        const lastMsg = msgs[msgs.length - 1] || { text: '' };
        return {
          name: who,
          initials: who.split(' ').map((w) => w[0]).join('').slice(0, 2),
          snippet: (lastMsg.mine ? 'You: ' : '') + lastMsg.text,
          badge: unread > 0 ? String(unread) : '·',
          badgeBg: unread > 0 ? '#b3462f' : 'transparent',
          badgeFg: unread > 0 ? '#fdf8ea' : 'color-mix(in srgb, var(--color-text) 45%, transparent)',
          chipBg: this.MAGNETS[i % this.MAGNETS.length],
          rowBg: unread > 0 ? 'color-mix(in srgb, var(--bot-c) 18%, transparent)' : 'transparent',
          onOpen: () => this.setState({
            dmOpenPid: pid,
            dms: this.state.dms.map((d) => (d.pid === pid ? Object.assign({}, d, { read: true }) : d))
          })
        };
      }),
      dmWho: dmWhoName,
      dmWhoInitials: dmWhoName.split(' ').map((w) => w[0]).join('').slice(0, 2),
      dmWhoChip: this.MAGNETS[Math.max(0, dmPids.indexOf(s.dmOpenPid)) % this.MAGNETS.length],
      dmMsgs: s.dms.filter((d) => d.pid === s.dmOpenPid).map((d) => ({
        text: d.text,
        align: d.mine ? 'flex-end' : 'flex-start',
        bg: d.mine ? 'var(--color-accent-300)' : 'transparent',
        fg: d.mine ? 'var(--color-on-accent)' : 'var(--color-text)',
        ring: d.mine ? 'none' : 'inset 0 0 0 1px color-mix(in srgb, var(--color-accent-500) 70%, transparent)'
      })),
      dmReplies: this.DM_REPLIES.map((r) => ({ label: r.label, onSend: () => this.sendDmReply(r) })),

      signupLabel: s.signedUp ? 'Signed up ✓' : 'Sign up',
      openSignup: () => this.setState({ showSignup: true }),
      closeSignup: () => this.setState({ showSignup: false }),
      showSignup: s.showSignup, signedUp: s.signedUp, signupForm: !s.signedUp,
      suName: s.suName, suUni: s.suUni,
      suNameIn: s.suNameIn, suUniIn: s.suUniIn, suMailIn: s.suMailIn, suError: s.suError,
      onSuName: (e) => this.setState({ suNameIn: e.target.value, suError: false }),
      onSuUni: (e) => this.setState({ suUniIn: e.target.value }),
      onSuMail: (e) => this.setState({ suMailIn: e.target.value, suError: false }),
      submitSignup: this.submitSignup,
      signupToMatch: () => this.navTo('match', { showSignup: false }),

      toast: s.toast, hasToast: !!s.toast
    };
  }
}
