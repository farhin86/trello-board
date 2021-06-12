import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import Board from "./index";
Enzyme.configure({ adapter: new Adapter() });

describe("Board Page", () => {
  it("Showing Add List Button", () => {
    const wrapper = shallow(<Board />);
    const btnText = wrapper.find("button").text();
    expect(btnText).toBe("Add list");
  });
  it("Should Show Add button on AddList click", () => {
    const wrapper = shallow(<Board />);
    const btn = wrapper.find("button");
    btn.simulate("click");
    const btnText = wrapper.find(".button-wrapper").text();
    expect(btnText).toBe("CancelAdd");
  });
});
