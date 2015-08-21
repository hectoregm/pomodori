require 'rails_helper'

RSpec.describe List, type: :model do
  before do
    @list = FactoryGirl.build(:list)
  end

  it 'is sane' do
    expect(@list).to be_valid
  end
end
