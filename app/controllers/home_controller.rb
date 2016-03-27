class HomeController < ApplicationController
  before_action :redirect_signed_in, only: [:index]

  def index
  end

  private

  def redirect_signed_in
    redirect_to dashboard_path if user_signed_in?
  end
end
