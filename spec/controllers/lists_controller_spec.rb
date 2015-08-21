require 'rails_helper'

RSpec.describe ListsController, type: :controller do

  describe "GET #index" do
    it "returns http success" do
      get :index
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET #create" do
    it "returns http success" do
      get :create
      expect(response).to have_http_status(:success)
    end
  end

  describe "DELETE #destroy" do
    it "destroys the requested list" do
      list = FactoryGirl.create(:list)
      expect do
        delete :destroy, id:list.to_param
      end.to change(List, :count).by(-1)
    end
  end
end
