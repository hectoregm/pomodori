require 'rails_helper'

RSpec.describe PomodoriController, type: :controller do
  let(:user) { FactoryGirl.create(:user) }
  let(:task) do
    FactoryGirl.create(:task)
  end

  let(:valid_attributes) do
    { task_id: task.id }
  end

  let(:invalid_attributes) do
    { name: '' }
  end

  before do
    allow(controller).to receive(:authenticate_user!)
    allow(controller).to receive(:current_user).and_return(user)
  end

  describe 'POST #create' do
    context 'with valid params' do
      it 'creates a new Pomodoro' do
        expect do
          post :create, task_id: task.id,  pomodoro: valid_attributes, format: :json
        end.to change(Pomodoro, :count).by(1)
      end

      it 'assigns a newly created pomodoro as @pomodoro' do
        post :create, task_id: task.id, pomodoro: valid_attributes, format: :json
        expect(assigns(:pomodoro)).to be_a(Pomodoro)
        expect(assigns(:pomodoro)).to be_persisted
      end

      it 'renders the newly created pomodoro in json format' do
        post :create, task_id: task.id, pomodoro: valid_attributes, format: :json
        expect(response).to render_template('show')
      end
    end

    context 'with invalid params' do
      it 'assigns a newly created but unsaved pomodoro as @pomodoro' do
        post :create, task_id: task.id, pomodoro: invalid_attributes, format: :json
        expect(assigns(:pomodoro)).to be_a_new(Pomodoro)
      end

      it 'render json' do
        post :create, task_id: task.id, pomodoro: invalid_attributes, format: :json
        expect(response.content_type).to eq('application/json')
      end
    end
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
