require 'rails_helper'

RSpec.describe Pomodoro do
  it 'is sane' do
    pomodoro = FactoryGirl.build(:pomodoro)
    expect(pomodoro).to be_valid
  end
end
