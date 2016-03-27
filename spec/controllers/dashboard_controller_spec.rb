require 'rails_helper'

RSpec.describe DashboardController, type: :controller do
  let(:user) { FactoryGirl.create(:user) }

  before do
    allow(controller).to receive(:authenticate_user!)
    allow(controller).to receive(:current_user).and_return(user)
  end

  describe 'GET #show' do
    it 'returns http success' do
      get :show
      expect(response).to have_http_status(:success)
    end
  end

  describe 'GET #today' do
    it 'returns http success' do
      get :today
      expect(response).to have_http_status(:success)
    end
  end

  describe 'GET #week' do
    it 'returns http success' do
      get :week
      expect(response).to have_http_status(:success)
    end
  end
end
