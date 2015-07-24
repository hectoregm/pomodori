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

  context 'estimate' do
    it 'has an estimate' do
      expect(@task).to respond_to(:estimate)
    end

    it 'be greater than or equal to one' do
      @task.estimate = 0
      expect(@task).to_not be_valid

      @task.estimate = 1
      expect(@task).to be_valid
    end
  end
end
