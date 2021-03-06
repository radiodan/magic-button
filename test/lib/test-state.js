var State = require(libDir + 'state');

describe('State', function() {
  beforeEach(function() {
    this.subject = State.create();
  });

  it('has a default state of standby', function() {
    assert.equal(this.subject.state, 'standby');
  });

  describe('standby', function() {
    beforeEach(function() {
      this.subject.state = 'standby';
    });

    it('transistions to online', function(){
      this.subject.handle('power');
      assert.equal(this.subject.state, 'online');
    });

    it('transistions to shutdown', function(){
      this.subject.handle('shutdown');
      assert.equal(this.subject.state, 'shutdown');
    });
  });

  describe('online', function() {
    beforeEach(function() {
      this.subject.state = 'online';
    });

    it('transistions to standby', function() {
      this.subject.handle('standby');
      assert.equal(this.subject.state, 'standby');
    });

    it('transistions to shutdown', function(){
      this.subject.handle('shutdown');
      assert.equal(this.subject.state, 'shutdown');
    });
  });

  describe('shutdown', function() {
    beforeEach(function() {
      this.subject.state = 'shutdown';
    });

    it('cannot transition', function(){
      this.subject.handle('online');
      assert.equal(this.subject.state, 'shutdown');
    });
  });

  describe('adding actions', function() {
    beforeEach(function(){
      this.actionStub = sinon.stub();
      this.actions = {'testAction': this.actionStub};
    });

    it('adds transitions to online state', function() {
      this.subject = State.create({ 'online': this.actions });

      this.subject.state = 'online';
      this.subject.handle('testAction');

      assert.equal(this.actionStub.callCount, 1);
    });

    it('adds transitions to standby', function() {
      this.subject = State.create({ 'standby': this.actions });

      this.subject.state = 'standby';
      this.subject.handle('testAction');
      assert.equal(this.actionStub.callCount, 1);
    });

    it('adds transitions to shutdown', function() {
      this.subject = State.create({ 'shutdown': this.actions });

      this.subject.state = 'shutdown';
      this.subject.handle('testAction');
      assert.equal(this.actionStub.callCount, 1);
    });

    it('can alter state', function() {
      var subject = State.create({'online':
        {'testAction': function() {
          this.handle('shutdown');
      }}});

      subject.state = 'online';
      subject.handle('testAction');

      assert.equal(subject.state, 'shutdown');
    });
  });
});
