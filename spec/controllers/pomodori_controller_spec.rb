require 'rails_helper'

RSpec.describe PomodoriController, type: :controller do
  let(:task) do
    FactoryGirl.create(:task)
  end

  let(:valid_attributes) do
    { task_id: task.id }
  end

  let(:invalid_attributes) do
    {}
  end

  describe 'GET #show' do
    it 'assigns the requested pomodoro as @pomodoro' do
      pomodoro = Pomodoro.create! valid_attributes
      get :show, id: pomodoro.to_param, task_id: task.id, format: :json
      expect(assigns(:pomodoro)).to eq(pomodoro)
    end
  end

  describe 'DELETE #destroy' do
    it 'destroys the requested pomodoro' do
      pomodoro = Pomodoro.create! valid_attributes
      expect do
        delete :destroy, id: pomodoro.to_param, task_id: task.id
      end.to change(Pomodoro, :count).by(-1)
    end

    it 'redirects to the associated task show page' do
      pomodoro = Pomodoro.create! valid_attributes
      delete :destroy, id: pomodoro.to_param, task_id: task.id
      expect(response).to redirect_to(task_path(task.id))
    end
  end
end
