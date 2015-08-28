require 'rails_helper'

RSpec.describe Project, type: :model do
  before do
    @project = FactoryGirl.build(:project)
  end

  it 'is sane' do
    expect(@project).to be_valid
  end
end
