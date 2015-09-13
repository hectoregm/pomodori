require 'rails_helper'

RSpec.describe DashboardController, type: :controller do
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
