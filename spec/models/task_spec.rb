require 'rails_helper'

RSpec.describe Task, type: :model do
  before do
    @task = FactoryGirl.build(:task)
  end

  it 'is sane' do
    expect(@task).to be_valid
  end

  context 'validation' do
    it 'requires a name' do
      expect(@task).to validate_presence_of(:name)
    end

    it 'has_many pomodori' do
      expect(@task).to have_many(:pomodori)
    end
  end
end
