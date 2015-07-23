Rails.application.routes.draw do
  resources :tasks do
    resources :pomodori, except: [:edit, :update, :destroy]
  end
  root 'tasks#index'
end
