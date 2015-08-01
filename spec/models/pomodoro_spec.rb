require 'rails_helper'

RSpec.describe Pomodoro do
  before do
    @pomodoro = FactoryGirl.build(:pomodoro)
  end

  it 'is sane' do
    expect(@pomodoro).to be_valid
  end

  context 'validation' do
    it 'requires a task' do
      expect(@pomodoro).to validate_presence_of(:task)
    end

    it 'belongs to a task' do
      expect(@pomodoro).to belong_to(:task)
    end
  end

  context 'long_break?' do
    it 'returns true if four pomodoros have completed in the last 2 hours' do
      initial_time = Time.current - 2.hours
      4.times do |n|
        expect(Pomodoro.long_break?).to be false

        FactoryGirl.create(:pomodoro,
                           started_at: initial_time + (n * 30).minutes)
      end

      expect(Pomodoro.long_break?).to be true
    end
  end
end
