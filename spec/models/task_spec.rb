require 'rails_helper'

RSpec.describe Task, type: :model do
  context 'validation' do
    it 'requires a name' do
      subscription = FactoryGirl.build(:task, name: '')
      expect(subscription).to validate_presence_of(:name)
    end
  end
end
