import * as THREE from "three";
import vertex from "../glsl/item.vert";
import fragment from "../glsl/item.frag";
import { MyObject3D } from "../webgl/myObject3D";
import { Update } from "../libs/update";
import { TexLoader } from "../webgl/texLoader";
import { Func } from "../core/func";

export class Images {
  // public items: Item[] = [];
  // private _images: { image: string; mask: string; selector: string }[] = [];
  constructor(container: THREE.Object3D) {
    const images = document.querySelectorAll(".image");
    images.forEach((image: any, index) => {
      const item = new Item(
        image.dataset.image,
        image.dataset.mask,
        `.image${index + 1}`
      );
      container.add(item);
      // this.items.push(item);
    });
  }
}

export class Item extends MyObject3D {
  private _material: THREE.ShaderMaterial;
  private _mesh: THREE.Mesh;
  private _selector: string;
  constructor(image: string, mask: string, selector: string) {
    super();

    this._selector = selector;
    const geometry = new THREE.PlaneGeometry(1, 1);
    this._material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        u_time: { value: Update.instance.elapsed },
        u_texture: { value: TexLoader.instance.get(image) },
        u_mask: { value: TexLoader.instance.get(mask) },
      },
    });

    this._mesh = new THREE.Mesh(geometry, this._material);
    this.add(this._mesh);
    this._updateWidthHeight();

    // lenis.on("scroll", () => {
    // });
  }

  private _updateWidthHeight() {
    const dom = document.querySelector(this._selector)!;
    const { width, height, x, y } = dom.getBoundingClientRect();

    const posX = -Func.instance.sw() / 2 + width / 2 + x;
    const posY = Func.instance.sh() / 2 - height / 2 - y;
    this.position.set(posX, posY, 0.01);
    this._mesh.scale.set(width, height, 1);
  }

  protected _update(): void {
    super._update();

    this._updateWidthHeight();
    this._material.uniforms.u_time.value = Update.instance.elapsed;
  }

  protected _resize(): void {
    super._resize();
    this._updateWidthHeight();
  }
}
