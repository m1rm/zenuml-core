let seqDsl = require('../../../src/parser/index');
let ToCollector = require('../../../src/parser/ToCollector')

function getParticipants(code) {
  let rootContext = seqDsl.RootContext(code);
  const toCollector = new ToCollector();
  return toCollector.getAllTos(toCollector)(rootContext);
}

describe('Plain participants', () => {
  test.each([
    'A', 'A\n', 'A\n\r'
  ])('get participant with width and stereotype undefined', (code) => {
    // `A` will be parsed as a participant which matches `participant EOF`
    let participants = getParticipants(code);
    expect(participants.size).toBe(1)
    expect(participants.get('A').width).toBeUndefined()
    expect(participants.get('A').stereotype).toBeUndefined()
  })
})
describe('with width', () => {
  test('with width', () => {
    let participants = getParticipants('A 1024');
    expect(participants.get('A').width).toBe(1024)
  })
  test('Redefining is ignored', () => {
    // `A` will be parsed as a participant which matches `participant EOF`
    let participants = getParticipants('A 1024\r\nA 1025');
    expect(participants.size).toBe(1)
    expect(participants.get('A').width).toBe(1024)
  })
})

describe('with interface', () => {
  test('<<A>> A1', () => {
    let participants = getParticipants('<<A>> A1')
    expect(participants.get('A1').stereotype).toBe('A')
  })
  test('Redefining is ignored', () => {
    let participants = getParticipants('<<A>> A1 A1')
    expect(participants.get('A1').stereotype).toBe('A')
  })
})

describe('implicit', () => {
  describe('from new', () => {
    test('from new', () => {
      let participants = getParticipants('new A()');
      expect(Array.from(participants.keys())[0]).toBe('A')
    })
    test('seqDsl should treat creation as a participant - assignment', () => {
      let participants = getParticipants('a = new A()');
      expect(participants.size).toBe(1)
      expect(participants.get('a:A').width).toBeUndefined()
    })
    test('seqDsl should treat creation as a participant - assignment with type', () => {
      let participants = getParticipants('A a = new A()');
      expect(participants.size).toBe(2)
      expect(participants.get('a:A').width).toBeUndefined()
    })
  })

  describe('from method call', () => {
    test('seqDsl should get all participants but ignore parameters - method call', () => {
      let participants = getParticipants('"b:B".method(x.m)');
      expect(participants.size).toBe(1)
      expect(participants.get('b:B').width).toBeUndefined()
    })
    test('seqDsl should get all participants but ignore parameters - creation', () => {
      let participants = getParticipants('"b:B".method(new X())');
      expect(participants.size).toBe(1)
      expect(participants.get('b:B').width).toBeUndefined()
    })

    test('seqDsl should get all participants including from', () => {
      let participants = getParticipants('A->B.m');
      expect(participants.size).toBe(2)
    })
  })
})

describe('Invalid input', () => {
  test('<<', () => {
    let participants = getParticipants('<<');
    expect(Array.from(participants.keys())[0]).toBe('Missing `Participant`')
  })
})








