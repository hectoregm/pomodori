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
end
